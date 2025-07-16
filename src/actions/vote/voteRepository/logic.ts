'use server';

import { updateWeeklyLeaderboard } from '@/actions/leaderboard/archive/logic';
import { prisma } from '@/lib/db';
import { getWeek } from '@/lib/utils/date';
import { Decimal } from '@prisma/client/runtime/library';
import { getTokenBalance } from '../../user/getTokenBalance/logic';
import { VoteRepositoryInput } from './schema';
import { publicClient } from '@/lib/viem';
import { InvalidTransactionError } from '@/lib/errors';

export const voteRepository = async (input: VoteRepositoryInput, userId: string) => {
  const currentWeek = getWeek(new Date());

  const transaction = await publicClient.getTransaction({
    hash: input.txHash as `0x${string}`
  });

  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: { walletAddress: true }
  });

  if (!transaction || transaction.from.toLowerCase() !== user.walletAddress.toLowerCase()) {
    throw new InvalidTransactionError('Invalid transaction.');
  }

  const block = await publicClient.getBlock({ blockHash: transaction.blockHash });
  const transactionTime = new Date(Number(block.timestamp) * 1000);
  const oneMinuteAgo = new Date(Date.now() - 60 * 1000);

  if (transactionTime < oneMinuteAgo) {
    throw new InvalidTransactionError('Transaction is too old.');
  }

  await prisma.$transaction(async tx => {
    const balance = await getTokenBalance(user.walletAddress);
    const userBalance = new Decimal(balance || '0');
    const tokenAmount = userBalance.mul(0.0025);

    const vote = await tx.vote.create({
      data: {
        userId,
        repositoryId: input.repositoryId,
        week: currentWeek,
        tokenAmount: userBalance.toNumber()
      }
    });

    await tx.payment.create({
      data: {
        userId: userId,
        walletAddress: user.walletAddress,
        tokenAmount,
        txHash: input.txHash,
        week: currentWeek,
        voteId: vote.id
      }
    });

    await tx.repository.update({
      where: {
        id: input.repositoryId
      },
      data: {
        totalVotes: {
          increment: 1
        },
        totalTokenAmount: {
          increment: tokenAmount
        }
      }
    });
  });
  await updateWeeklyLeaderboard(currentWeek);
};
