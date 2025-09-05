import { prisma } from '@/lib/prisma';
import { ToggleFavoriteInput } from './schema';

export type ToggleFavoriteResult = {
  isFavorited: boolean;
  repositoryId: string;
};

export async function toggleFavorite(
  input: ToggleFavoriteInput,
  userId: string
): Promise<ToggleFavoriteResult> {
  const { repositoryId } = input;

  // First, check if the user already has this repository in favorites
  const existingFavorite = await prisma.userFavorite.findUnique({
    where: {
      userId_repositoryId: {
        userId,
        repositoryId
      }
    }
  });

  // If favorite exists, remove it
  if (existingFavorite) {
    await prisma.userFavorite.delete({
      where: {
        id: existingFavorite.id
      }
    });

    return {
      isFavorited: false,
      repositoryId
    };
  }

  // If favorite doesn't exist, create it
  await prisma.userFavorite.create({
    data: {
      userId,
      repositoryId
    }
  });

  return {
    isFavorited: true,
    repositoryId
  };
}
