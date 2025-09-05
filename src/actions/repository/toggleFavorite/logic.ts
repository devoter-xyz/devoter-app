import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
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
  try {
    // Try to remove existing favorite (atomic on composite key)
    await prisma.userFavorite.delete({
      where: { userId_repositoryId: { userId, repositoryId } }
    });
    return { isFavorited: false, repositoryId };
  } catch (err) {
    // Not found => create; any other error => rethrow
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      try {
        await prisma.userFavorite.create({ data: { userId, repositoryId } });
        return { isFavorited: true, repositoryId };
      } catch (e) {
        // Concurrent create by another request
        if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
          return { isFavorited: true, repositoryId };
        }
        throw e;
      }
    }
    throw err;
  }
}