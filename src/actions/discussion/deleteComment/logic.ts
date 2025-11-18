import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { DeleteCommentSchema } from './schema';

export const deleteComment = async ({ commentId }: DeleteCommentSchema) => {
  const session = await getSession();

  if (!session?.userId) {
    throw new Error('You must be logged in to delete a comment.');
  }

  const result = await prisma.discussion.deleteMany({
    where: {
      id: commentId,
      userId: session.userId,
    },
  });

  if (result.count === 0) {
    throw new Error('Comment not found or you are not authorized to delete this comment.');
  }

  return { success: true };
};
