import { NetworkError, BadRequestError } from '@/lib/errors';
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
  try {
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
  } catch (error) {
    console.error("Error fetching repositories:", error);
    if (error instanceof NetworkError || error instanceof BadRequestError) {
      throw error;
    }
    throw new NetworkError("Failed to fetch repositories due to an unexpected error.", error as Error);
  }
};
