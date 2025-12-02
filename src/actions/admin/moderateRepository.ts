
'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function moderateRepository(
  repositoryId: string,
  action: 'toggleVerified' | 'toggleFeatured' | 'unflag',
) {
  // TODO: Implement admin authentication/authorization

  const repository = await prisma.repository.findUnique({
    where: {
      id: repositoryId,
    },
  });

  if (!repository) {
    throw new Error('Repository not found');
  }

  switch (action) {
    case 'toggleVerified':
      await prisma.repository.update({
        where: {
          id: repositoryId,
        },
        data: {
          isVerified: !repository.isVerified,
        },
      });
      break;
    case 'toggleFeatured':
      await prisma.repository.update({
        where: {
          id: repositoryId,
        },
        data: {
          featured: !repository.featured,
        },
      });
      break;
    case 'unflag':
      await prisma.repository.update({
        where: {
          id: repositoryId,
        },
        data: {
          isFlagged: false,
        },
      });
      break;
    default:
      throw new Error('Invalid moderation action');
  }

  revalidatePath('/admin');
  revalidatePath(`/repository/${repositoryId}`);
}
