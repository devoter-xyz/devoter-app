'use server';

import { actionClient } from '@/lib/actions';
import { getRepositories } from './logic';
import { GetRepositoriesInput } from './schema';

export const getRepositoriesAction = actionClient
  .inputSchema(GetRepositoriesInput)
  .action(getRepositories);
