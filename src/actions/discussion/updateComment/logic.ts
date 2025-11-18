import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { UpdateCommentSchema } from './schema';

export const updateComment = async ({ commentId, content }: UpdateCommentSchema) => {
  const session = await getSession();

  if (!session?.userId) {
    throw new Error('You must be logged in to update a comment.');
  }

  const updatedComment = await prisma.discussion.updateMany({
    where: {
      id: commentId,
      userId: session.userId,
    },
    data: {
      content,
    },
  });

  if (updatedComment.count === 0) {
    throw new Error('Comment not found or you are not authorized to update this comment.');
  }

  return updatedComment;
};
