'use server';

import { updateWeeklyLeaderboard } from '@/actions/leaderboard/archive/logic';
import { prisma } from '@/lib/db';
import { getWeek } from '@/lib/utils/date';
import crypto from 'crypto';
import { VoteRepositoryInput } from './schema';

export const voteRepository = async (input: VoteRepositoryInput, userId: string) => {
  const currentWeek = getWeek(new Date());
  const tokenAmount = 1;

  await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUniqueOrThrow({
      where: { id: userId },
      select: { walletAddress: true }
    });

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
        tokenAmount: tokenAmount,
        txHash: `0x${crypto.randomBytes(32).toString('hex')}`,
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
