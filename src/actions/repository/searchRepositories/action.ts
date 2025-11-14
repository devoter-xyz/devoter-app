import { protectedAction } from '@/lib/actions';
import { searchRepositoriesSchema } from './schema';
import { searchRepositoriesLogic } from './logic';

export const searchRepositories = protectedAction(searchRepositoriesSchema, async (input, { user }) => {
  const { query, page, pageSize } = input;
  const { repositories, totalCount } = await searchRepositoriesLogic(query, page, pageSize);
  return { repositories, totalCount };
});
