'use server';

import { updateWeeklyLeaderboard } from '@/actions/leaderboard/archive/logic';
import { prisma } from '@/lib/db';
import { getWeek } from '@/lib/utils/date';
import { Decimal } from '@prisma/client/runtime/library';
import { getTokenBalance } from '../../user/getTokenBalance/logic';
import { VoteRepositoryInput } from './schema';

export const voteRepository = async (input: VoteRepositoryInput, userId: string) => {
  const currentWeek = getWeek(new Date());

  await prisma.$transaction(async tx => {
    const user = await tx.user.findUniqueOrThrow({
      where: { id: userId },
      select: { walletAddress: true }
    });

    const balance = await getTokenBalance(user.walletAddress);
    const userBalance = new Decimal(balance || '0');
    const tokenAmount = userBalance.mul(0.0025);

    const vote = await tx.vote.create({
      data: {
        userId,
        repositoryId: input.repositoryId,
        week: currentWeek,
        tokenAmount
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
