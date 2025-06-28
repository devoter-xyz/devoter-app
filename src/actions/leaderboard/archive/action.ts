'use server';

import { prisma } from '@/lib/db';
import { getWeek } from '@/lib/utils';

export const archiveWeeklyLeaderboard = async () => {
  const currentWeekId = getWeek(new Date());

  // 1. Calculate this week's votes for all repositories
  const repositories = await prisma.repository.findMany({
    select: {
      id: true,
      votes: {
        where: {
          week: currentWeekId,
        },
        select: {
          tokenAmount: true,
        },
      },
    },
  });

  // 2. Rank repositories by total token amount
  const rankedRepositories = repositories
    .map(repo => ({
      ...repo,
      totalTokens: repo.votes.reduce((acc, vote) => acc + Number(vote.tokenAmount), 0),
    }))
    .sort((a, b) => b.totalTokens - a.totalTokens);

  // 3. Archive the results
  const archivePromises = rankedRepositories.map((repo, index) => {
    return prisma.weeklyRepoLeaderboard.create({
      data: {
        repoId: repo.id,
        week: currentWeekId,
        rank: index + 1,
      },
    });
  });

  await Promise.all(archivePromises);

  return { success: true };
};
