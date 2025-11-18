import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { CreateCommentSchema } from './schema';

export const createComment = async ({ repositoryId, content }: CreateCommentSchema) => {
  const session = await getSession();

  if (!session?.userId) {
    throw new Error('You must be logged in to comment.');
  }

  const comment = await prisma.discussion.create({
    data: {
      repositoryId,
      userId: session.userId,
      content,
    },
  });

  return comment;
};
