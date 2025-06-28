'use server';

import { actionClient } from '@/lib/actions';
import { getRepositories } from './logic';

export const getRepositoriesAction = actionClient
  .inputSchema(getRepositories)
  .action(getRepositories);
