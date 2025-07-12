'use server';

import { updateWeeklyLeaderboard } from '@/actions/leaderboard/archive/logic';
import { prisma } from '@/lib/db';
import { getWeek } from '@/lib/utils/date';
import crypto from 'crypto';
import { VoteRepositoryInput } from './schema';
import { devTokenContract } from '@/lib/thirdweb';

const MINIMUM_VOTE_TOKEN_AMOUNT = 1;

export const voteRepository = async (input: VoteRepositoryInput, userId: string) => {
  const currentWeek = getWeek(new Date());
  const tokenAmount = 1;

  await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUniqueOrThrow({
      where: { id: userId },
      select: { walletAddress: true }
    });

    const balance = await (await devTokenContract).erc20.balanceOf(user.walletAddress);

    if (parseInt(balance.displayValue || '0') < MINIMUM_VOTE_TOKEN_AMOUNT) {
      throw new Error(
        'You do not have enough DEV tokens to vote. You can buy some from Uniswap: https://app.uniswap.org/explore/tokens/base/0x047157cffb8841a64db93fd4e29fa3796b78466c'
      );
    }

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
