import { z } from 'zod';

export const getVotesByUserSchema = z.object({
  week: z.string(),
});

export type GetVotesByUserInput = z.infer<typeof getVotesByUserSchema>; 