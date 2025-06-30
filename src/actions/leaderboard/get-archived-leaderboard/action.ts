'use server';

import { actionClient } from '@/lib/actions';
import { getArchivedLeaderboardSchema } from './schema';
import { getArchivedLeaderboard } from './logic';

export const getArchivedLeaderboardAction = actionClient
  .inputSchema(getArchivedLeaderboardSchema)
  .action(async ({ parsedInput }) => {
    return getArchivedLeaderboard(parsedInput);
  });
