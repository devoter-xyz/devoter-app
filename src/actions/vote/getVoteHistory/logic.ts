'use server';

import { prisma } from '@/lib/db';
import { Decimal } from '@prisma/client/runtime/library';

export type UserVoteHistory = {
  voteId: string;
  title: string;
  githubUrl: string;
  description: string;
  tokenAmount: Decimal;
  createdAt: Date;
};

export const getVoteHistory = async (userId: string): Promise<Record<string, UserVoteHistory[]>> => {
  const votes = await prisma.vote.findMany({
    where: {
      userId: userId
    },
    select: {
      id: true,
      tokenAmount: true,
      createdAt: true,
      week: true,
      repository: {
        select: {
          title: true,
          githubUrl: true,
          description: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const groupedVotes: Record<string, UserVoteHistory[]> = {};

  for (const vote of votes) {
    if (!groupedVotes[vote.week]) {
      groupedVotes[vote.week] = [];
    }
    groupedVotes[vote.week].push({
      voteId: vote.id,
      title: vote.repository.title,
      githubUrl: vote.repository.githubUrl,
      description: vote.repository.description,
      tokenAmount: vote.tokenAmount,
      createdAt: vote.createdAt
    });
  }

  return groupedVotes;
}; 