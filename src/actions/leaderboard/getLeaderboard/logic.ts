import { prisma } from '@/lib/db';
import { Decimal } from '@prisma/client/runtime/library';
import type { GetLeaderboardInput } from './schema';

export type LeaderboardEntry = {
  rank: number;
  repository: {
    id: string;
    title: string;
    description: string;
    githubUrl: string;
    submitter: {
      walletAddress: string;
    };
    uniqueVoteCount: number;
    totalVotingPower: Decimal;
  };
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

  const votes = await prisma.vote.findMany({
    where: {
      repositoryId: { in: repoIds },
      week: week
    },
    select: {
      repositoryId: true,
      userId: true,
      tokenAmount: true
    }
  });

  const repoStats = votes.reduce(
    (acc, vote) => {
      if (!acc[vote.repositoryId]) {
        acc[vote.repositoryId] = {
          uniqueVoters: new Set<string>(),
          totalVotingPower: new Decimal(0)
        };
      }
      acc[vote.repositoryId].uniqueVoters.add(vote.userId);
      acc[vote.repositoryId].totalVotingPower = acc[vote.repositoryId].totalVotingPower.add(
        vote.tokenAmount
      );
      return acc;
    },
    {} as Record<string, { uniqueVoters: Set<string>; totalVotingPower: Decimal }>
  );

  const leaderboardWithStats: LeaderboardEntry[] = leaderboard.map(entry => {
    const stats = repoStats[entry.repository.id] || {
      uniqueVoters: new Set(),
      totalVotingPower: new Decimal(0)
    };
    return {
      rank: entry.rank,
      repository: {
        ...entry.repository,
        uniqueVoteCount: stats.uniqueVoters.size,
        totalVotingPower: stats.totalVotingPower
      }
    };
  });

  return {
    leaderboard: leaderboardWithStats,
    total
  };
}
