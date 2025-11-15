import { authActionClient } from '@/lib/actions';
import { searchRepositoriesSchema } from './schema';
import { searchRepositoriesLogic } from './logic';
import { z } from 'zod';

export const searchRepositories = authActionClient
  .inputSchema(searchRepositoriesSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { query, page, pageSize } = parsedInput;
    const { repositories, totalCount } = await searchRepositoriesLogic(query, page, pageSize);
    return { repositories, totalCount };
  });
