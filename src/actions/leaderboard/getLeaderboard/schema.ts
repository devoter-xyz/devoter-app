import { z } from 'zod';

export const getLeaderboardSchema = z.object({
  week: z.string(),
  page: z.number().optional().default(1),
  pageSize: z.number().optional().default(10)
});

export type GetLeaderboardInput = z.infer<typeof getLeaderboardSchema>;
