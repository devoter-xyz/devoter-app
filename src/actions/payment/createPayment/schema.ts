import { z } from 'zod';

export const createPaymentSchema = z.object({
  amount: z.number(),
  transactionHash: z.string(),
});

export type CreatePaymentPayload = z.infer<typeof createPaymentSchema>;
