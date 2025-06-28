import { prisma } from '@/lib/prisma';
import { GetRepositoriesInput, GetRepositoriesOutput } from './schema';

export const getRepositories = async ({
  sortBy,
  sortOrder,
  limit,
  page,
  week
}: GetRepositoriesInput): Promise<GetRepositoriesOutput> => {
  const whereClause = week ? { weekId: week } : {};
  const skip = (page - 1) * limit;

  const [repositories, total] = await Promise.all([
    prisma.repository.findMany({
      where: whereClause,
      orderBy: {
        [sortBy]: sortOrder
      },
      include: {
        submitter: true
      },
      skip,
      take: limit
    }),
    prisma.repository.count({ where: whereClause })
  ]);

  // Manually convert Decimal to string to avoid serialization errors.
  // This is necessary because the prisma model has a Decimal field `totalTokenAmount`
  // that is not defined in the zod schema, but is returned by `findMany`
  const serializedRepositories = repositories.map(repo => {
    const { totalTokenAmount, ...rest } = repo;
    return {
      ...rest,
      totalTokenAmount: totalTokenAmount.toString()
    };
  });

  return {
    repositories: serializedRepositories,
    total
  };
};
