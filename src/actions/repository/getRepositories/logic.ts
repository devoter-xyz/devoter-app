import { prisma } from '@/lib/prisma';
import { GetRepositoriesInput } from './schema';

export type RepositoryWithVotes = {
  id: string;
  title: string;
  description: string | null;
  submitter: {
    walletAddress: string;
  };
  githubUrl: string;
  totalVotes: number;
};

export type GetRepositoriesResult = {
  repositories: RepositoryWithVotes[];
  total: number;
};

export const getRepositories = async ({ week }: GetRepositoriesInput): Promise<GetRepositoriesResult> => {
  const whereClause = week ? { votes: { some: { week: week } } } : {};

  const [repositories, total] = await Promise.all([
    prisma.repository.findMany({
      where: whereClause,
      select: {
        id: true,
        title: true,
        description: true,
        githubUrl: true,
        submitter: true,
        votes: {
          where: {
            week: week
          }
        }
      }
    }),
    prisma.repository.count({ where: whereClause })
  ]);

  return {
    repositories: repositories.map((repository) => ({
      ...repository,
      totalVotes: repository.votes.reduce((acc, vote) => acc + vote.tokenAmount.toNumber(), 0)
    })),
    total
  };
};
