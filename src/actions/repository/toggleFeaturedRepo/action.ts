import { adminActionClient } from '@/lib/actions';
import { toggleFeaturedRepo } from './logic';
import { toggleFeaturedRepoSchema } from './schema';

export const toggleFeaturedRepoAction = adminActionClient
  .inputSchema(toggleFeaturedRepoSchema)
  .action(async ({ parsedInput }) => {
    try {
      const result = await toggleFeaturedRepo(parsedInput);
      return result;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to toggle featured repository');
    }
  });
