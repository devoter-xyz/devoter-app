import { protectedAction } from '@/lib/actions';
import { searchRepositoriesSchema } from './schema';
import { searchRepositoriesLogic } from './logic';

export const searchRepositories = protectedAction(searchRepositoriesSchema, async (input, { user }) => {
  const { query } = input;
  const repositories = await searchRepositoriesLogic(query);
  return repositories;
});
