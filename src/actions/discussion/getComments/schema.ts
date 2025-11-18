import { z } from 'zod';

export const getCommentsSchema = z.object({
  repositoryId: z.string().uuid(),
  limit: z.number().int().min(1).max(100).default(10),
  offset: z.number().int().min(0).default(0),
});

export type GetCommentsSchema = z.infer<typeof getCommentsSchema>;
