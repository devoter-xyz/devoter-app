import { z } from "zod";

export const updateNotificationPreferencesSchema = z.object({
  newVoteNotification: z.boolean().default(true),
  leaderboardNotification: z.boolean().default(true),
  newRepoNotification: z.boolean().default(true),
  favoriteTagNotification: z.boolean().default(true),
});

export type UpdateNotificationPreferencesInput = z.infer<typeof updateNotificationPreferencesSchema>;
