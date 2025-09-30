
import { z } from 'zod';

export const envSchema = z.object({
  NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: z.string(),
  SESSION_ENCRYPTION_KEY: z.string(),
  DATABASE_URL: z.string(),
});

// Allow bypass if NODE_ENV or MODE is 'test'
const mode = process.env.MODE || process.env.NODE_ENV;

export const env =
  mode === 'test'
    ? {
        NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? '',
        SESSION_ENCRYPTION_KEY: process.env.SESSION_ENCRYPTION_KEY ?? '',
        DATABASE_URL: process.env.DATABASE_URL ?? '',
      }
    : envSchema.parse(process.env);