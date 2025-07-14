'use server';

import { updateWeeklyLeaderboard } from '@/actions/leaderboard/archive/logic';
import { MINIMUM_VOTE_TOKEN_AMOUNT } from '@/lib/constants';
import { prisma } from '@/lib/db';
import { InsufficientTokenBalanceError } from '@/lib/errors';
import { devTokenContract } from '@/lib/thirdweb';
import { getWeek } from '@/lib/utils/date';
import { Decimal } from '@prisma/client/runtime/library';
import crypto from 'crypto';
import { VoteRepositoryInput } from './schema';

export const voteRepository = async (input: VoteRepositoryInput, userId: string) => {
  const currentWeek = getWeek(new Date());

  await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUniqueOrThrow({
      where: { id: userId },
      select: { walletAddress: true }
    });

    const balance = await (await devTokenContract).erc20.balanceOf(user.walletAddress);

    if (parseInt(balance.displayValue || '0') < MINIMUM_VOTE_TOKEN_AMOUNT) {
      throw new InsufficientTokenBalanceError();
    }

    const tokenAmount = new Decimal(balance.displayValue || '0');

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
