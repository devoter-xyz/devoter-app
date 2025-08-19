'use server';

import { actionClient } from '@/lib/actions';
import { getTopReposThisWeek } from './logic';
import { getTopReposThisWeekSchema } from './schema';

export const getTopReposThisWeekAction = actionClient
  .inputSchema(getTopReposThisWeekSchema)
  .action(async ({ parsedInput }) => {
    return getTopReposThisWeek(parsedInput.limit);
  });
