import { prisma } from '@/lib/db';
import { GetFavoriteRepositoriesInput } from './schema';

export type FavoriteRepository = {
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
  totalVotes: number;
  createdAt: Date;
  favoriteAdded: Date;
};

export type GetFavoriteRepositoriesResult = {
  repositories: FavoriteRepository[];
  total: number;
};

export async function getFavoriteRepositories(
  userId: string,
  { pageSize = 10, page = 1 }: GetFavoriteRepositoriesInput
): Promise<GetFavoriteRepositoriesResult> {
  const skip = (page - 1) * pageSize;
  // Get the total count of favorites
  const totalCount = await prisma.userFavorite.count({
    where: {
      userId
    }
  });

  // Get user favorites with repository details
  const userFavorites = await prisma.userFavorite.findMany({
    where: {
      userId
    },
    include: {
      repository: {
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
          totalVotes: true,
          createdAt: true,
          _count: {
            select: {
              votes: true
            }
          }
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: pageSize,
    skip: skip
  });

  // Map the results to the expected format
  const repositories = userFavorites.map((favorite) => ({
    id: favorite.repository.id,
    name: favorite.repository.name,
    owner: favorite.repository.owner,
    title: favorite.repository.title,
    description: favorite.repository.description,
    githubUrl: favorite.repository.githubUrl,
    websiteUrl: favorite.repository.websiteUrl,
    docsUrl: favorite.repository.docsUrl,
    logoUrl: favorite.repository.logoUrl,
    tags: favorite.repository.tags,
    githubStars: favorite.repository.githubStars,
    githubForks: favorite.repository.githubForks,
    isVerified: favorite.repository.isVerified,
    totalVotes: favorite.repository.totalVotes,
    createdAt: favorite.repository.createdAt,
    favoriteAdded: favorite.createdAt
  }));

  return {
    repositories,
    total: totalCount
  };
}
