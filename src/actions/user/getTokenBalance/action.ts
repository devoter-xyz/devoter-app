'use server';

import { authActionClient } from '@/lib/actions';
import { getTokenBalance } from './logic';
import { prisma } from '@/lib/prisma';

export const getTokenBalanceAction = authActionClient
  .action(async ({ ctx }) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: ctx.session.userId },
      });

      if (!user || !user.walletAddress) {
        throw new Error('User or wallet address not found');
      }

      return await getTokenBalance(user.walletAddress);
    } catch (error) {
      throw new Error('Something went wrong', { cause: error });
    }
  }); 