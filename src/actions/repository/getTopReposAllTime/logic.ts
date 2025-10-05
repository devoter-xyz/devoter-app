'use server';

import { prisma } from '@/lib/db';
import { Decimal } from '@prisma/client/runtime/library';

export type TopRepoAllTime = {
  id: string;
  name: string | null;
  owner: string | null;
  title: string;
  description: string;
  githubUrl: string;
  websiteUrl: string | null;
  docsUrl: string | null;
  logoUrl: string | null;
  tags: string[];
  githubStars: number;
  githubForks: number;
  isVerified: boolean;
  submitter: {
    walletAddress: string;
  };
  totalVotes: number;
  totalTokenAmount: Decimal;
  uniqueVoters: number;
};

export type GetTopReposAllTimeResult = {
  repositories: TopRepoAllTime[];
};

export const getTopReposAllTime = async (limit: number = 10): Promise<GetTopReposAllTimeResult> => {
  const repositories = await prisma.repository.findMany({
    select: {
      id: true,
      name: true,
      owner: true,
      title: true,
      description: true,
      githubUrl: true,
      websiteUrl: true,
      docsUrl: true,
      logoUrl: true,
      tags: true,
      githubStars: true,
      githubForks: true,
      isVerified: true,
      submitter: {
        select: {
          walletAddress: true
        }
      },
      votes: {
        select: {
          userId: true,
          tokenAmount: true
        }
      }
    }
  });

  const repositoriesWithStats = repositories.map((repo) => {
    const stats = repo.votes.reduce(
      (acc, vote) => {
        acc.uniqueVoters.add(vote.userId);
        acc.totalTokenAmount = acc.totalTokenAmount.add(vote.tokenAmount);
        acc.totalVotes += 1;
        return acc;
      },
      {
        uniqueVoters: new Set<string>(),
        totalTokenAmount: new Decimal(0),
        totalVotes: 0
      }
    );

    const { votes: _votes, ...repoData } = repo;

    return {
      ...repoData,
      totalVotes: stats.totalVotes,
      totalTokenAmount: stats.totalTokenAmount,
      uniqueVoters: stats.uniqueVoters.size
    };
  });

  const topRepositories = repositoriesWithStats
    .sort((a, b) => b.totalTokenAmount.comparedTo(a.totalTokenAmount))
    .slice(0, limit);

  return {
    repositories: topRepositories
  };
};
