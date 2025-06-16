import { z } from 'zod';

export const signInSchema = z.object({
  message: z.string(),
  signature: z.string(),
  nonce: z.string(),
});

export type SignInPayload = z.infer<typeof signInSchema>;