
import { z } from 'zod';

export const envSchema = z.object({
  NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: z.string().min(1, { message: 'NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is required.' }),
  SESSION_ENCRYPTION_KEY: z.string().min(1, { message: 'SESSION_ENCRYPTION_KEY is required.' }),
  DATABASE_URL: z.string().url({ message: 'DATABASE_URL must be a valid URL.' }),
  GITHUB_API_TOKEN: z.string().min(1, { message: 'GITHUB_API_TOKEN is required in production.' }),
  REDIS_URL: z.string().url({ message: 'REDIS_URL must be a valid URL.' }),
  NODE_ENV: z.enum(['development', 'production', 'test'], { message: 'NODE_ENV must be either "development", "production", or "test".' }),
  NEXT_PUBLIC_THIRDWEB_CLIENT_ID: z.string().min(1, { message: 'NEXT_PUBLIC_THIRDWEB_CLIENT_ID is required.' }),
  NEXT_PUBLIC_THIRDWEB_SECRET_KEY: z.string().min(1, { message: 'NEXT_PUBLIC_THIRDWEB_SECRET_KEY is required.' }),
});

// Allow bypass if NODE_ENV or MODE is 'test'
const mode = process.env.MODE || process.env.NODE_ENV;

export const env =
  mode === 'test'
    ? {
        NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? '',
        SESSION_ENCRYPTION_KEY: process.env.SESSION_ENCRYPTION_KEY ?? '',
        DATABASE_URL: process.env.DATABASE_URL ?? '',
        GITHUB_API_TOKEN: process.env.GITHUB_API_TOKEN ?? '',
        REDIS_URL: process.env.REDIS_URL ?? '',
        NODE_ENV: (process.env.NODE_ENV as 'development' | 'production' | 'test') ?? 'test',
        NEXT_PUBLIC_THIRDWEB_CLIENT_ID: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID ?? '',
        NEXT_PUBLIC_THIRDWEB_SECRET_KEY: process.env.NEXT_PUBLIC_THIRDWEB_SECRET_KEY ?? '',
      }
    : envSchema.parse(process.env);