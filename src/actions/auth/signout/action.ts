'use server';

import { authActionClient } from '@/lib/actions';
import { signOut } from './logic';

export const signOutAction = authActionClient
  .action(async () => {
    try {
      await signOut();
    } catch (error) {
      throw new Error('Something went wrong', { cause: error });
    }
  });
