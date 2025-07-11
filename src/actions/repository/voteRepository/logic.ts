'use server';

import { prisma } from '@/lib/db';
import { getWeek } from '@/lib/utils/date';
import { VoteRepositoryInput } from './schema';

export const voteRepository = async (input: VoteRepositoryInput, userId: string) => {
  const currentWeek = getWeek(new Date());
  const tokenAmount = 0.01;

  const existingVote = await prisma.vote.findFirst({
    where: {
      userId,
      week: currentWeek,
    },
  });

  if (existingVote) {
    throw new Error('You can only vote for one repository per week.');
  }

  const vote = await prisma.vote.create({
    data: {
      userId,
      repositoryId: input.repositoryId,
      week: currentWeek,
      tokenAmount,
    },
  });

  await prisma.repository.update({
    where: {
      id: input.repositoryId,
    },
    data: {
      totalVotes: {
        increment: 1,
      },
      totalTokenAmount: {
        increment: tokenAmount,
      },
    },
  });

  return vote;
}; 