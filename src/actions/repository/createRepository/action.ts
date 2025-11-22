'use server';

import { authActionClient } from '@/lib/actions';
import { createRepository } from './logic';
import { createRepositorySchema } from './schema';
import { DuplicateRepositoryError, WeeklySubmissionLimitError, InvalidGitHubUrlError } from '@/lib/errors';

export const createRepositoryAction = authActionClient
  .inputSchema(createRepositorySchema)
  .action(async ({ parsedInput, ctx }) => {
    try {
      const result = await createRepository(parsedInput, ctx.session.userId);
      return result;
    } catch (error) {
      if (error instanceof DuplicateRepositoryError || error instanceof WeeklySubmissionLimitError || error instanceof InvalidGitHubUrlError) {
        throw error;
      }
      throw new BadRequestError('Something went wrong');
    }
  });
