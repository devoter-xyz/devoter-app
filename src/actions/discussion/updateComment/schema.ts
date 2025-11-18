import { z } from 'zod';

export const updateCommentSchema = z.object({
  commentId: z.string().uuid(),
  content: z.string().min(1).max(1000),
});

export type UpdateCommentSchema = z.infer<typeof updateCommentSchema>;
