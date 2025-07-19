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
  const { week, page = 1, pageSize = 10 } = input;
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

  if (leaderboard.length === 0) {
    return {
      leaderboard: [],
      total
    };
  }

  const repoIds = leaderboard.map(entry => entry.repository.id);

  const voteCounts = await prisma.vote.groupBy({
    by: ['repositoryId'],
    where: {
      repositoryId: { in: repoIds },
      week: week
    },
    _count: {
      userId: true
    }
  });

  const voteCountMap = voteCounts.reduce(
    (acc, curr) => {
      acc[curr.repositoryId] = curr._count.userId;
      return acc;
    },
    {} as Record<string, number>
  );

  return {
    leaderboard: leaderboard.map(entry => ({
      rank: entry.rank,
      repository: {
        ...entry.repository,
        totalVotes: voteCountMap[entry.repository.id] || 0
      }
    })),
    total
  };
}
