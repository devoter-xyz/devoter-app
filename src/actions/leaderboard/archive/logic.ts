'use server';

import { prisma } from '@/lib/db';
import { getWeek } from '@/lib/utils/date';
import { Prisma } from '@prisma/client';

type PrismaTransactionClient = Prisma.TransactionClient;

export const updateWeeklyLeaderboardRanks = async (tx: PrismaTransactionClient, week: string) => {
  // 1. Calculate this week's votes for all repositories
  const repositories = await tx.repository.findMany({
    where: {
      votes: {
        some: {
          week: week
        }
      }
    },
    select: {
      id: true,
      votes: {
        where: {
          week: week
        },
        select: {
          tokenAmount: true
        }
      }
    }
  });

  // 2. Rank repositories by total token amount
  const rankedRepositories = repositories
    .map(repo => ({
      ...repo,
      totalTokens: repo.votes.reduce((acc, vote) => acc + Number(vote.tokenAmount), 0)
    }))
    .sort((a, b) => b.totalTokens - a.totalTokens);

  // 3. Archive the results
  for (let i = 0; i < rankedRepositories.length; i++) {
    const repo = rankedRepositories[i];
    await tx.weeklyRepoLeaderboard.upsert({
      where: {
        repoId_week: {
          repoId: repo.id,
          week: week
        }
      },
      update: {
        rank: i + 1
      },
      create: {
        repoId: repo.id,
        week: week,
        rank: i + 1
      }
    });
  }
};

export const archiveWeeklyLeaderboard = async () => {
  const currentWeekId = getWeek(new Date());

  await prisma.$transaction(async tx => {
    await updateWeeklyLeaderboardRanks(tx, currentWeekId);
  });

  return { success: true };
};
