import { prisma } from '@/lib/db';
import { getWeek } from '@/lib/utils';
import { GetLeaderboardInput } from './schema';
import { Prisma } from '@prisma/client';

type RepositoryWithVotes = Prisma.RepositoryGetPayload<{
  include: {
    votes: true;
    submitter: true;
  };
}>;

export async function getLeaderboard(input: GetLeaderboardInput) {
  const { week: inputWeek } = input;
  const week = inputWeek ?? getWeek(new Date());

  const where = {
    votes: {
      some: {
        week: week,
      },
    },
  };

  const repositories = await prisma.repository.findMany({
    where,
    include: {
      votes: {
        where: {
          week: week,
        },
      },
      submitter: true,
    },
  });

  const total = repositories.length;

  const leaderboard = repositories
    .map((repo: RepositoryWithVotes) => ({
      ...repo,
      voteCount: repo.votes.length,
    }))
    .sort((a, b) => b.voteCount - a.voteCount);

  return {
    leaderboard,
    total,
  };
}
