import { z } from 'zod';

export const createCommentSchema = z.object({
  repositoryId: z.string().uuid(),
  content: z.string().min(1).max(1000),
});

export type CreateCommentSchema = z.infer<typeof createCommentSchema>;
