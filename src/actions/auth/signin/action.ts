'use server';

import { signInSchema } from '@/actions/auth/signin/schema';
import { actionClient } from '@/lib/actions';
import { signIn } from './logic';

export const signInAction = actionClient
  .inputSchema(signInSchema)
  .action(async ({ parsedInput }) => {
    try {
      const result = await signIn(parsedInput);
      return result;
    } catch (error) {
      throw new Error('Something went wrong', { cause: error });
    }
  });
