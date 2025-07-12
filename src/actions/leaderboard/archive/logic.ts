'use server';

import { prisma } from '@/lib/db';

export const updateWeeklyLeaderboard = async (week: string) => {
  // 1. Calculate this week's votes for all repositories
  const repositories = await prisma.repository.findMany({
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
    .map((repo) => ({
      ...repo,
      totalTokens: repo.votes.reduce((acc, vote) => acc + Number(vote.tokenAmount), 0)
    }))
    .sort((a, b) => b.totalTokens - a.totalTokens);

  // 3. Archive the results
  for (const [i, repo] of rankedRepositories.entries()) {
    await prisma.weeklyRepoLeaderboard.upsert({
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
