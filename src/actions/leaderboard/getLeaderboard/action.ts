'use server';

import { actionClient } from '@/lib/actions';
import { getLeaderboard, getAvailableLeaderboardWeeks } from './logic';
import { getLeaderboardSchema } from './schema';

export const getLeaderboardAction = actionClient.inputSchema(getLeaderboardSchema).action(async ({ parsedInput }) => {
  return getLeaderboard(parsedInput);
});

export const getAvailableLeaderboardWeeksAction = actionClient.action(async () => {
  return getAvailableLeaderboardWeeks();
});
