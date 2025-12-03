import Redis from 'ioredis';
import { env } from './env';

const redis = new Redis(env.REDIS_URL);

interface RateLimitOptions {
  /** The maximum number of requests allowed within the time window. */
  limit: number;
  /** The time window in seconds. */
  window: number;
}

/**
 * Checks and enforces rate limiting for a given action and identifier.
 *
 * @param actionType A string identifying the type of action (e.g., 'vote', 'create_repo').
 * @param identifier A unique string identifying the user or client (e.g., user ID, IP address).
 * @param options Rate limiting options: limit and window size in seconds.
 * @returns A promise that resolves to `true` if the request is allowed, `false` otherwise.
 */
export async function checkRateLimit(
  actionType: string,
  identifier: string,
  options: RateLimitOptions,
): Promise<{ allowed: boolean; key: string }> {
  const key = `rate_limit:${actionType}:${identifier}`;
  const now = Date.now();
  const windowStart = now - options.window * 1000;

  // Remove timestamps older than the window
  await redis.zremrangebyscore(key, 0, windowStart);

  // Get current request count within the window
  const currentRequests = await redis.zcard(key);

  if (currentRequests < options.limit) {
    // Add current request timestamp
    await redis.zadd(key, now.toString(), now.toString());
    // Set expiration for the key to clean up old data
    await redis.expire(key, options.window);
    return { allowed: true, key };
  } else {
    return { allowed: false, key };
  }
}

export class RateLimitError extends Error {
  readonly retryAfter: number; // In seconds
  constructor(message: string, retryAfter: number) {
    super(message);
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
  }
}

/**
 * Middleware for rate limiting server actions.
 *
 * @param action The server action function to wrap.
 * @param actionType A string identifying the type of action for rate limiting.
 * @param options Rate limiting options: limit and window size in seconds.
 * @returns A new function that applies rate limiting before executing the original action.
 */
export function rateLimitMiddleware<T extends (...args: any[]) => Promise<any>>(
  action: T,
  actionType: string,
  options: RateLimitOptions,
): T {
  return (async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    // In a real application, you'd get the user ID from the session or request context.
    // For now, let's use a placeholder or assume it's passed as an argument if available.
    // For demonstration, I'll use a generic identifier.
    // TODO: Replace with actual user ID or IP address from session/request.
    const userId = 'anonymous'; // Placeholder

    const { allowed, key } = await checkRateLimit(actionType, userId, options);

    if (!allowed) {
      // Calculate how long until the next request is allowed
      const timestamps = await redis.zrange(key, 0, -1, 'WITHSCORES');
      // WITHSCORES returns [member, score, ...]; score is at index 1
      const oldestTimestamp = timestamps.length > 0 ? parseInt(timestamps[1], 10) : Date.now();
      const retryAfterMs = (oldestTimestamp + options.window * 1000) - Date.now();
      const retryAfterSeconds = Math.max(0, Math.ceil(retryAfterMs / 1000));

      throw new RateLimitError(`Rate limit exceeded for ${actionType}. Please try again in ${retryAfterSeconds} seconds.`, retryAfterSeconds);
    }

    return action(...args);
  }) as T;
}
