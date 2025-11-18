import { z } from 'zod';

export const deleteCommentSchema = z.object({
  commentId: z.string().uuid(),
});

export type DeleteCommentSchema = z.infer<typeof deleteCommentSchema>;
