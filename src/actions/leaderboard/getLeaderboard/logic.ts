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

  const leaderboardWithVotes = await prisma.weeklyRepoLeaderboard.findMany({
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
          },
          votes: {
            where: {
              week: week
            },
            select: {
              userId: true,
              tokenAmount: true
            }
          }
        }
      }
    }
  });

  const total = await prisma.weeklyRepoLeaderboard.count({
    where: { week }
  });

  if (leaderboardWithVotes.length === 0) {
    return {
      leaderboard: [],
      total
    };
  }

  const leaderboardWithStats: LeaderboardEntry[] = leaderboardWithVotes.map((entry) => {
    const stats = entry.repository.votes.reduce(
      (acc, vote) => {
        acc.uniqueVoters.add(vote.userId);
        acc.totalVotingPower = acc.totalVotingPower.add(vote.tokenAmount);
        return acc;
      },
      { uniqueVoters: new Set<string>(), totalVotingPower: new Decimal(0) }
    );

    const { votes: _votes, ...repositoryData } = entry.repository;

    return {
      rank: entry.rank,
      repository: {
        ...repositoryData,
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
