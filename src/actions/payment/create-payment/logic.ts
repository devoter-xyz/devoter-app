import { prisma } from '@/lib/prisma';
import { CreatePaymentPayload } from './schema';
import { SessionData } from '@/lib/session';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { getISOWeek, getYear } from 'date-fns';
import { ethers } from 'ethers';

// Initialize the SDK on the appropriate chain
const sdk = new ThirdwebSDK('ethereum'); // Or your specific chain

const recipientWalletAddress = process.env.RECIPIENT_WALLET_ADDRESS;

if (!recipientWalletAddress) {
  throw new Error('Recipient wallet address is not configured.');
}

export const createPayment = async (payload: CreatePaymentPayload, session: SessionData) => {
  // 1. Validate the transaction on-chain
  const txHash = payload.transactionHash;
  const transaction = await sdk.getProvider().getTransaction(txHash);

  if (!transaction) {
    throw new Error('Transaction not found on-chain.');
  }

  if (transaction.to?.toLowerCase() !== recipientWalletAddress.toLowerCase()) {
    throw new Error('Transaction was not sent to the correct wallet address.');
  }

  const expectedAmountInWei = ethers.utils.parseEther(payload.amount.toString());
  if (!transaction.value.eq(expectedAmountInWei)) {
    throw new Error('Transaction amount does not match the expected amount.');
  }

  // 2. Format the week string
  const now = new Date();
  const year = getYear(now);
  const weekNumber = getISOWeek(now);
  const week = `${year}-W${String(weekNumber).padStart(2, '0')}`;

  // 3. Create the payment record
  const paymentRecord = await prisma.payment.create({
    data: {
      userId: session.userId,
      tokenAmount: payload.amount,
      txHash: payload.transactionHash,
      walletAddress: session.walletAddress,
      week: week,
    },
  });

  return { paymentRecord };
};
