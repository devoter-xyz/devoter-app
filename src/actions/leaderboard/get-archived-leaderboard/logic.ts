import { prisma } from '@/lib/db';
import type { GetArchivedLeaderboardInput } from './schema';

export async function getArchivedLeaderboard(input: GetArchivedLeaderboardInput) {
  const { week } = input;
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
} 