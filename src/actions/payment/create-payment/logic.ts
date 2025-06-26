import { prisma } from '@/lib/prisma';
import { CreatePaymentPayload } from './schema';
import { SessionData } from '@/lib/session';

export const createPayment = async (payload: CreatePaymentPayload, session: SessionData) => {
  const paymentRecord = await prisma.payment.create({
    data: {
      userId: session.userId,
      tokenAmount: payload.amount,
      txHash: payload.transactionHash,
      walletAddress: session.walletAddress, // Assuming walletAddress is in session
      week: new Date().toISOString(), // This should be calculated based on the week
    },
  });
  return { paymentRecord };
};
