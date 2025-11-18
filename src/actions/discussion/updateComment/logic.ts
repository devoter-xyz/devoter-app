import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';
import { UpdateCommentSchema } from './schema';

export const updateComment = async ({ commentId, content }: UpdateCommentSchema) => {
  const session = await getAuthSession();

  if (!session?.user) {
    throw new Error('You must be logged in to update a comment.');
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
    throw new Error('You are not authorized to update this comment.');
  }

  const updatedComment = await prisma.discussion.update({
    where: {
      id: commentId,
    },
    data: {
      content,
    },
  });

  return updatedComment;
};
