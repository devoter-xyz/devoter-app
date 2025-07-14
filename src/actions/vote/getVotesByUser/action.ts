'use server';

import { authActionClient } from '@/lib/actions';
import { getVotesByUser } from './logic';
import { getVotesByUserSchema } from './schema';

export const getVotesByUserAction = authActionClient
  .inputSchema(getVotesByUserSchema)
  .action(async ({ parsedInput, ctx }) => {
    try {
      return await getVotesByUser(parsedInput, ctx.session.userId);
    } catch (error) {
      throw new Error('Something went wrong', { cause: error });
    }
  }); 