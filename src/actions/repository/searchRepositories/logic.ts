import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function searchRepositoriesLogic(
  query: string,
  page: number = 1,
  pageSize: number = 20,
) {
  const lowercasedTokens = query.trim().split(/\s+/).filter(Boolean).map((token) => token.toLowerCase());

  const whereClause = {
    OR: [
      { title: { contains: query, mode: Prisma.QueryMode.insensitive } },
      { description: { contains: query, mode: Prisma.QueryMode.insensitive } },
      { owner: { contains: query, mode: Prisma.QueryMode.insensitive } },
      { tags: { hasSome: lowercasedTokens } },
    ],
  };

  const repositories = await prisma.repository.findMany({
    where: whereClause,
    skip: (page - 1) * pageSize,
    take: pageSize,
    include: {
      votes: true,
      favorites: true,
    },
  });

  const totalCount = await prisma.repository.count({
    where: whereClause,
  });

  return { repositories, totalCount };
}
