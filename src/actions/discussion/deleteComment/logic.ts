import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';
import { DeleteCommentSchema } from './schema';

export const deleteComment = async ({ commentId }: DeleteCommentSchema) => {
  const session = await getAuthSession();

  if (!session?.user) {
    throw new Error('You must be logged in to delete a comment.');
  }

  const existingComment = await prisma.discussion.findUnique({
    where: {
      id: commentId,
    },
  });

  if (!existingComment) {
    throw new Error('Comment not found.');
  }

  if (existingComment.userId !== session.user.id) {
    throw new Error('You are not authorized to delete this comment.');
  }

  await prisma.discussion.delete({
    where: {
      id: commentId,
    },
  });

  return { success: true };
};
