import { prisma } from '@/lib/prisma';
import { GetCommentsSchema } from './schema';

export const getComments = async ({ repositoryId, limit, offset }: GetCommentsSchema) => {
  const comments = await prisma.discussion.findMany({
    where: {
      repositoryId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
          walletAddress: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: limit,
    skip: offset,
  });

  const totalComments = await prisma.discussion.count({
    where: {
      repositoryId,
    },
  });

  return {
    comments,
    totalComments,
  };
};
