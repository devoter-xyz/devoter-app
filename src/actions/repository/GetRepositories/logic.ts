import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { z } from 'zod';

export const GetRepositoriesInput = z.object({
  sortBy: z.enum(['createdAt', 'totalVotes']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  limit: z.number().min(1).max(100).default(10),
  page: z.number().min(1).default(1),
  week: z.string().optional()
});

const repositoryWithVotes = Prisma.validator<Prisma.RepositoryDefaultArgs>()({
  include: { submitter: true, votes: true }
});

export type GetRepositoriesOutput = {
  repositories: Prisma.RepositoryGetPayload<typeof repositoryWithVotes>[];
  total: number;
};

export const getRepositories = async ({
  sortBy,
  sortOrder,
  limit,
  page,
  week
}: z.infer<typeof GetRepositoriesInput>): Promise<GetRepositoriesOutput> => {
  const whereClause = week ? { votes: { some: { week: week } } } : {};
  const skip = (page - 1) * limit;

  const [repositories, total] = await Promise.all([
    prisma.repository.findMany({
      where: whereClause,
      orderBy: {
        [sortBy]: sortOrder
      },
      include: {
        submitter: true,
        votes: {
          where: {
            week: week
          }
        }
      },
      skip,
      take: limit
    }),
    prisma.repository.count({ where: whereClause })
  ]);

  return {
    repositories,
    total
  };
};
