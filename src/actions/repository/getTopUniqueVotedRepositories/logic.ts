import { prisma } from '@/lib/db';
import type { Repository } from '@prisma/client';
import { subDays } from 'date-fns';

export async function getWeeklyTopReposLogic() {
  const oneWeekAgo = subDays(new Date(), 7);

  const repos = await prisma.repository.findMany({
    where: {
      createdAt: {
        gte: oneWeekAgo,
      },
    },
    include: {
      _count: {
        select: { votes: true },
      },
    },
    orderBy: {
      votes: {
        _count: 'desc',
      },
    },
    take: 10, // Adjust as needed
  });

  return repos.map((repo: Repository & { _count: { votes: number } }) => {
    const urlParts = new URL(repo.githubUrl).pathname.split('/').filter(Boolean);
    const owner = urlParts[0] || 'unknown';

    return {
      id: repo.id,
      owner: owner,
      name: repo.title,
      description: repo.description,
      tags: [], // Assuming no tags are available on the Repository model for now
      votes: repo._count.votes,
    };
  });
}
