import { z } from 'zod';

export const getLeaderboardSchema = z.object({
  week: z.string().optional(),
  page: z.number().min(1).optional().default(1),
  limit: z.number().min(1).max(100).optional().default(10),
});

export type GetLeaderboardInput = z.infer<typeof getLeaderboardSchema>;
