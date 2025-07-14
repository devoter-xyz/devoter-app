'use server';

import { authActionClient } from '@/lib/actions';
import { getTokenBalance } from './logic';

export const getTokenBalanceAction = authActionClient
  .action(async ({ ctx }) => {
    try {
      return await getTokenBalance(ctx.session.userId);
    } catch (error) {
      throw new Error('Something went wrong', { cause: error });
    }
  }); 