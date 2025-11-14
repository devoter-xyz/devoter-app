
import { z } from 'zod';

export const searchRepositoriesSchema = z.object({
  query: z.string().min(1, 'Search query cannot be empty'),
});
