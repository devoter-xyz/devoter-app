import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';
import { CreateCommentSchema } from './schema';

export const createComment = async ({ repositoryId, content }: CreateCommentSchema) => {
  const session = await getAuthSession();

  if (!session?.user) {
    throw new Error('You must be logged in to comment.');
  }

  const comment = await prisma.discussion.create({
    data: {
      repositoryId,
      userId: session.user.id,
      content,
    },
  });

  return comment;
};
