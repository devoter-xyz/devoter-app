import { prisma } from "@/lib/prisma";
import { getCurrentWeek } from "@/lib/utils/date";

export type VoteTrendData = {
  date: string;
  votes: number;
};

export type UniqueVoterData = {
  date: string;
  uniqueVoters: number;
};

export type VotingPowerDistribution = {
  voterId: string;
  voterName: string;
  votes: number;
};

export type WeeklyPerformance = {
  currentWeekVotes: number;
  previousWeekVotes: number;
};

export type RepositoryAnalytics = {
  voteTrends: VoteTrendData[];
  uniqueVoters: UniqueVoterData[];
  votingPowerDistribution: VotingPowerDistribution[];
  weeklyPerformance: WeeklyPerformance;
};

export async function getRepositoryAnalyticsLogic(repositoryId: string): Promise<RepositoryAnalytics> {
  // Fetch vote trends over time (daily votes)
  const voteTrends = await prisma.$queryRaw<VoteTrendData[]>`
    SELECT
      "createdAt"::date as date,
      COUNT(*)::int as votes
    FROM "Vote"
    WHERE repositoryId = ${repositoryId}
    GROUP BY "createdAt"::date
    ORDER BY date ASC;
  `;

  // Fetch unique voters over time (daily unique voters)
  const uniqueVoters = await prisma.$queryRaw<UniqueVoterData[]>`
    SELECT
      "createdAt"::date as date,
      COUNT(DISTINCT userId)::int as uniqueVoters
    FROM "Vote"
    WHERE repositoryId = ${repositoryId}
    GROUP BY "createdAt"::date
    ORDER BY date ASC;
  `;

  // Fetch voting power distribution
  const votingPowerDistribution = await prisma.$queryRaw<VotingPowerDistribution[]>`
    SELECT
      u.id as voterId,
      u.name as voterName,
      COUNT(v.id)::int as votes
    FROM "Vote" v
    JOIN "User" u ON v.userId = u.id
    WHERE v.repositoryId = ${repositoryId}
    GROUP BY u.id, u.name
    ORDER BY votes DESC;
  `;

  // Fetch weekly performance
  const { start: currentWeekStart } = getCurrentWeek();
  const previousWeekStart = new Date(currentWeekStart);
  previousWeekStart.setDate(currentWeekStart.getDate() - 7);

  const currentWeekVotes = await prisma.vote.count({
    where: {
      repositoryId: repositoryId,
      createdAt: {
        gte: currentWeekStart,
      },
    },
  });

  const previousWeekVotes = await prisma.vote.count({
    where: {
      repositoryId: repositoryId,
      createdAt: {
        gte: previousWeekStart,
        lt: currentWeekStart,
      },
    },
  });

  const weeklyPerformance: WeeklyPerformance = {
    currentWeekVotes,
    previousWeekVotes,
  };

  return {
    voteTrends,
    uniqueVoters,
    votingPowerDistribution,
    weeklyPerformance,
  };
}
