import { RepositoryWithVotes } from '@/actions/repository/getRepositories/logic';
import { prisma } from '@/lib/db';
import type { GetLeaderboardInput } from './schema';

export type LeaderboardEntry = {
  rank: number;
  repository: RepositoryWithVotes;
};

export async function getLeaderboard(input: GetLeaderboardInput): Promise<LeaderboardEntry[]> {
  const { week } = input;
  const leaderboard = await prisma.weeklyRepoLeaderboard.findMany({
    where: { week },
    orderBy: { rank: 'asc' },
    select: {
      rank: true,
      repository: {
        select: {
          id: true,
          title: true,
          description: true,
          githubUrl: true,
          submitter: true,
          votes: {
            select: {
              tokenAmount: true
            }
          }
        }
      }
    }
  });

  return leaderboard.map((entry) => ({
    rank: entry.rank,
    repository: {
      ...entry.repository,
      totalVotes: entry.repository.votes.reduce((acc, vote) => acc + vote.tokenAmount.toNumber(), 0)
    }
  }));
}

export async function getAvailableLeaderboardWeeks(): Promise<string[]> {
  const weeks = await prisma.weeklyRepoLeaderboard.findMany({
    distinct: ['week'],
    orderBy: { week: 'desc' },
    select: { week: true }
  });
  return weeks.map(w => w.week);
}
