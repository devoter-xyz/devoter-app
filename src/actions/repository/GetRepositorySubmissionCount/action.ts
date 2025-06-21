'use server';

import { authActionClient } from '@/lib/actions';
import { getRepositorySubmissionCount } from './logic';

export const getRepositorySubmissionCountAction = authActionClient.action(
  async ({ ctx }) => {
    try {
      const result = await getRepositorySubmissionCount(ctx.session.userId);
      return result;
    } catch (error) {
      throw new Error('Something went wrong', { cause: error });
    }
  }
);
