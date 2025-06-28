'use server';

import { prisma } from '@/lib/db';
import { z } from 'zod';
import { actionClient } from '@/lib/actions';

const schema = z.object({
  week: z.string(),
});

export const getArchivedLeaderboardAction = actionClient.inputSchema(schema).action(async ({ week }) => {
  const leaderboard = await prisma.weeklyRepoLeaderboard.findMany({
    where: { week },
    orderBy: { rank: 'asc' },
    include: {
      repository: {
        include: {
          submitter: true,
        },
      },
    },
  });

  // Manually convert Decimal to string to avoid serialization errors.
  const serializedLeaderboard = leaderboard.map(entry => ({
    ...entry,
    repository: {
      ...entry.repository,
      totalTokenAmount: entry.repository.totalTokenAmount.toString(),
    },
  }));

  return serializedLeaderboard;
});
