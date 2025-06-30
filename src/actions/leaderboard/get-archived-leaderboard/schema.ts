import { z } from 'zod';

export const getArchivedLeaderboardSchema = z.object({
  week: z.string(),
});

export type GetArchivedLeaderboardInput = z.infer<typeof getArchivedLeaderboardSchema>;
