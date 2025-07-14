'use server';

import { authActionClient } from '@/lib/actions';
import { getTokenBalance } from './logic';
import { GetTokenBalanceSchema } from './schema';

export const getTokenBalanceAction = authActionClient
  .inputSchema(GetTokenBalanceSchema)
  .action(async ({ ctx }) => {
    try {
      return await getTokenBalance(ctx.session.userId);
    } catch (error) {
      throw new Error('Something went wrong', { cause: error });
    }
  }); 