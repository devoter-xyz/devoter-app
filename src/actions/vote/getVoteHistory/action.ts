'use server';

import { authActionClient } from '@/lib/actions';
import { getVoteHistory } from './logic';
import { getVoteHistorySchema } from './schema';

export const getVoteHistoryAction = authActionClient
  .inputSchema(getVoteHistorySchema)
  .action(async ({ ctx }) => {
    try {
      return await getVoteHistory({}, ctx.session.userId);
    } catch (error) {
      throw new Error('Something went wrong', { cause: error });
    }
  }); 