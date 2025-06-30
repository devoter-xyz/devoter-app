import { z } from 'zod';

export const getLeaderboardSchema = z.object({
  week: z.string()
});

export type GetLeaderboardInput = z.infer<typeof getLeaderboardSchema>;
