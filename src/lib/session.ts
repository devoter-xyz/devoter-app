import { env } from '@/lib/env';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import { cookies } from 'next/headers';
import { COOKIE_NAME } from './constants';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;

// Ensure we have a 32-byte key by padding or truncating
const key = Buffer.from(env.SESSION_ENCRYPTION_KEY.padEnd(32, '0').slice(0, 32));

export type SessionData = {
  userId: string;
};

export function encryptSession(data: SessionData): string {
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);

  const encrypted = Buffer.concat([cipher.update(JSON.stringify(data), 'utf8'), cipher.final()]);

  const authTag = cipher.getAuthTag();

  // Combine IV, encrypted data, and auth tag
  return Buffer.concat([iv, encrypted, authTag]).toString('base64');
}

export function decryptSession(encryptedData: string): SessionData {
  const buffer = Buffer.from(encryptedData, 'base64');

  const iv = buffer.subarray(0, IV_LENGTH);
  const authTag = buffer.subarray(buffer.length - AUTH_TAG_LENGTH);
  const encrypted = buffer.subarray(IV_LENGTH, buffer.length - AUTH_TAG_LENGTH);

  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);

  return JSON.parse(decrypted.toString('utf8'));
}

export async function getSession(): Promise<SessionData | null> {

  const cookieStore = await cookies();
  const session = cookieStore.get(COOKIE_NAME);
  try {
    return session ? decryptSession(session.value) : null;
  } catch (error) {
    console.warn('Failed to decrypt session:', error);
    return null;
  }
}

export async function setSessionCookie(session: SessionData): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, encryptSession(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
} 
