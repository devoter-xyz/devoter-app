import { db } from '@/lib/db';
import { getWeek } from '@/lib/utils';
import { GetLeaderboardInput } from './schema';

export async function getLeaderboard(input: GetLeaderboardInput) {
  const { week: inputWeek, page, limit } = input;
  const week = inputWeek ?? getWeek();

  const where = {
    votes: {
      some: {
        week: week,
      },
    },
  };

  const [repositories, total] = await Promise.all([
    db.repository.findMany({
      where,
      include: {
        votes: {
          where: {
            week: week,
          },
        },
        submitter: true,
      },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.repository.count({ where }),
  ]);

  const leaderboard = repositories
    .map((repo) => ({
      ...repo,
      voteCount: repo.votes.length,
    }))
    .sort((a, b) => b.voteCount - a.voteCount);

  return {
    leaderboard,
    total,
  };
}
