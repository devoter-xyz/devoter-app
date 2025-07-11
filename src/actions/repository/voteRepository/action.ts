'use server';

import { authActionClient } from '@/lib/actions';
import { voteRepository } from './logic';
import { voteRepositorySchema } from './schema';

export const voteRepositoryAction = authActionClient
  .inputSchema(voteRepositorySchema)
  .action(async ({ parsedInput, ctx }) => {
    try {
      await voteRepository(parsedInput, ctx.session.userId);
      return { success: true };
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'An unexpected error occurred.');
    }
  }); 