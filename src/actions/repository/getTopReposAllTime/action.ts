'use server';

import { actionClient } from '@/lib/actions';
import { getTopReposAllTime } from './logic';
import { getTopReposAllTimeSchema } from './schema';

export const getTopReposAllTimeAction = actionClient
  .inputSchema(getTopReposAllTimeSchema)
  .action(async ({ parsedInput }) => {
    return getTopReposAllTime(parsedInput.limit);
  });
