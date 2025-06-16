'use server';

import { actionClient } from '@/lib/actions';
import { getUserFromSession } from './logic';

export const getUserFromSessionAction = actionClient.action(async () => {
  try {
    const user = await getUserFromSession();
    return user;
  } catch (error) {
    throw new Error('Something went wrong', { cause: error });
  }
});