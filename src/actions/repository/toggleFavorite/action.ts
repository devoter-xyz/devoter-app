'use server';

import { authActionClient } from '@/lib/actions';
import { toggleFavorite } from './logic';
import { toggleFavoriteSchema } from './schema';

export const toggleFavoriteAction = authActionClient
  .inputSchema(toggleFavoriteSchema)
  .action(async ({ parsedInput, ctx }) => {
    try {
      const result = await toggleFavorite(parsedInput, ctx.session.userId);
      return result;
    } catch (error) {
      throw new Error('Failed to toggle favorite', { cause: error });
    }
  });
