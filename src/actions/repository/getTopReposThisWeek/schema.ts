import { z } from 'zod';

export const getTopReposThisWeekSchema = z.object({
  limit: z.number().min(1).max(50).optional().default(10)
});


export type GetTopReposThisWeekInput = z.infer<typeof getTopReposThisWeekSchema>;
