import { prisma } from '@/lib/db';
import { ToggleFeaturedRepoInput } from './schema';

export const toggleFeaturedRepo = async (input: ToggleFeaturedRepoInput) => {
  const { repoId } = input;

  // First, get the current featured status
  const repository = await prisma.repository.findUnique({
    where: { id: repoId },
    select: { id: true, featured: true, title: true }
  });

  if (!repository) {
    throw new Error('Repository not found');
  }

  // Toggle the featured status
  const updatedRepository = await prisma.repository.update({
    where: { id: repoId },
    data: { featured: !repository.featured },
    select: {
      id: true,
      title: true,
      featured: true,
      updatedAt: true
    }
  });

  return updatedRepository;
};
