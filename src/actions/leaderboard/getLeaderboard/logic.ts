import { RepositoryWithVotes } from '@/actions/repository/getRepositories/logic';
import { prisma } from '@/lib/db';
import type { GetLeaderboardInput } from './schema';

export type LeaderboardEntry = {
  rank: number;
  repository: RepositoryWithVotes;
};

export type GetLeaderboardOutput = {
  leaderboard: LeaderboardEntry[];
  total: number;
};

export async function getLeaderboard(input: GetLeaderboardInput): Promise<GetLeaderboardOutput> {
  const { week, page = 1, pageSize = 1 } = input;
  const skip = (page - 1) * pageSize;

  const leaderboard = await prisma.weeklyRepoLeaderboard.findMany({
    where: { week },
    orderBy: { rank: 'asc' },
    skip,
    take: pageSize,
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

  const total = await prisma.weeklyRepoLeaderboard.count({
    where: { week }
  });

  return {
    leaderboard: leaderboard.map((entry) => ({
      rank: entry.rank,
      repository: {
        ...entry.repository,
        votes: entry.repository.totalVotes
      }
    })),
    total
  };
}
