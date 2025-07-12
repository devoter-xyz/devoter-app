'use server';

import { authActionClient } from '@/lib/actions';
import { voteRepository } from './logic';
import { voteRepositorySchema } from './schema';

export const voteRepositoryAction = authActionClient
  .inputSchema(voteRepositorySchema)
  .action(async ({ parsedInput, ctx }) => {
    await voteRepository(parsedInput, ctx.session.userId);
    return { success: true };
  });
