'use server';

import { authActionClient } from '@/lib/actions';
import { getFavoriteRepositories } from './logic';
import { getFavoriteRepositoriesSchema } from './schema';

export const getFavoriteRepositoriesAction = authActionClient
  .inputSchema(getFavoriteRepositoriesSchema)
  .action(async ({ parsedInput, ctx }) => {
    try {
      const result = await getFavoriteRepositories(ctx.session.userId, parsedInput);
      return {
        success: true,
        data: result
      };
    } catch (error) {
      console.error('Error fetching favorite repositories:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch favorite repositories'
      };
    }
  });
