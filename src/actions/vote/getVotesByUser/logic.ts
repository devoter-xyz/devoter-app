'use server';

import { prisma } from '@/lib/db';
import { GetVotesByUserInput } from './schema';

export const getVotesByUser = async (input: GetVotesByUserInput, userId: string) => {
  const votes = await prisma.vote.findMany({
    where: {
      userId: userId,
      week: input.week,
    },
    select: {
      repositoryId: true,
    },
  });

  return votes.map((vote) => vote.repositoryId);
}; 