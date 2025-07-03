'use server';

import { authActionClient } from '@/lib/actions';
import { createRepository } from './logic';
import { createRepositorySchema } from './schema';

export const createRepositoryAction = authActionClient
  .inputSchema(createRepositorySchema)
  .action(async ({ parsedInput, ctx }) => {
    try {
      const result = await createRepository(parsedInput, ctx.session.userId);
      return result;
    } catch (error) {
      throw new Error('Something went wrong', { cause: error });
    }
  });
