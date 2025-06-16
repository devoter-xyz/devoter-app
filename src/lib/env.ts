import { z } from 'zod';

export const envSchema = z.object({
  NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: z.string(),
  SESSION_ENCRYPTION_KEY: z.string(),
  DATABASE_URL: z.string(),
});

export const env = envSchema.parse(process.env);