import { prisma } from '@/lib/db';
import type { GetLeaderboardInput } from './schema';
import { RepositoryWithVotes } from '@/actions/repository/getRepositories/logic';

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
          totalVotes: true,
          submitter: {
            select: {
              walletAddress: true
            }
          }
        }
      }
    }
  });

  return leaderboard.map((entry: { rank: any; repository: { totalVotes: any; }; }) => ({
    rank: entry.rank,
    repository: {
      ...entry.repository,
      votes: entry.repository.totalVotes
    }
  }));
}
