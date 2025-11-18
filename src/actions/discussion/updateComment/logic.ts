import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { UpdateCommentSchema } from './schema';

export const updateComment = async ({ commentId, content }: UpdateCommentSchema) => {
  const session = await getSession();

  if (!session?.userId) {
    throw new Error('You must be logged in to update a comment.');
  }

  try {
    const updatedComment = await prisma.discussion.update({
      where: {
        id: commentId,
        userId: session.userId,
      },
      data: {
        content,
      },
    });
    return updatedComment;
  } catch (error: any) {
    if (error.code === 'P2025') {
      throw new Error('Comment not found or you are not authorized to update this comment.');
    }
    throw error;
  }
};
