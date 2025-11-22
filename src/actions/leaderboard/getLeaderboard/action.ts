'use server';

import { NetworkError, BadRequestError } from '@/lib/errors';
import { actionClient } from '@/lib/actions';
import { getLeaderboard } from './logic';
import { getLeaderboardSchema } from './schema';

export const getLeaderboardAction = actionClient.inputSchema(getLeaderboardSchema).action(async ({ parsedInput }) => {
  try {
    return await getLeaderboard(parsedInput);
  } catch (error) {
    console.error("Error in getLeaderboardAction:", error);
    if (error instanceof NetworkError || error instanceof BadRequestError) {
      throw error;
    }
    throw new BadRequestError("An unexpected error occurred while fetching the leaderboard.");
  }
});

