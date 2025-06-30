import { z } from 'zod';

export const getLeaderboardSchema = z.object({
  week: z.string().optional(),
});

export type GetLeaderboardInput = z.infer<typeof getLeaderboardSchema>;
