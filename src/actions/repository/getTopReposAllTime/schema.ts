import { z } from 'zod';

export const getTopReposAllTimeSchema = z.object({
  limit: z.number().min(1).max(50).optional().default(10),
});

export type GetTopReposAllTimeInput = z.infer<typeof getTopReposAllTimeSchema>;
