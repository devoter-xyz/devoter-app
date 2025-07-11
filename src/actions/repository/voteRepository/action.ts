'use server';

import { authActionClient } from '@/lib/actions';
import { voteRepository } from './logic';
import { voteRepositorySchema } from './schema';

export const voteRepositoryAction = authActionClient
  .inputSchema(voteRepositorySchema)
  .action(async ({ parsedInput, ctx }) => {
    try {
      const result = await voteRepository(parsedInput, ctx.session.userId);
      return result;
    } catch (error) {
      throw new Error('Something went wrong', { cause: error });
    }
  }); 