import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { authActionClient } from '@/lib/actions';

export const createPaymentRecordSchema = z.object({
  repositoryId: z.string(),
  amount: z.number(),
  transactionHash: z.string(),
});

export const createPaymentRecordAction = authActionClient
  .inputSchema(createPaymentRecordSchema)
  .action(async ({ parsedInput, ctx }) => {
    const paymentRecord = await prisma.payment.create({
      data: {
        userId: ctx.session.userId,
        repositoryId: parsedInput.repositoryId,
        tokenAmount: parsedInput.amount,
        txHash: parsedInput.transactionHash,
        walletAddress: ctx.session.walletAddress, // Assuming walletAddress is in session
        week: new Date().toISOString(), // This should be calculated based on the week
      },
    });
    return { paymentRecord };
  }); 