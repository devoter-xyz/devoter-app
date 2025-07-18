'use server';

import { prisma } from '@/lib/db';
import { GetVoteHistoryInput } from './schema';

export const getVoteHistory = async (input: GetVoteHistoryInput, userId: string) => {
  return await prisma.vote.findMany({
    where: {
      userId: userId,
    },
    include: {
      repository: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}; 