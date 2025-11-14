import { prisma } from '@/lib/prisma';

export async function searchRepositoriesLogic(query: string) {
  const repositories = await prisma.repository.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { owner: { contains: query, mode: 'insensitive' } },
        { tags: { has: query } },
      ],
    },
    include: {
      votes: true,
      favorites: true,
    },
  });

  return repositories;
}
