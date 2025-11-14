
import { z } from 'zod';

export const searchRepositoriesSchema = z.object({
  query: z.string().min(1, 'Search query cannot be empty'),
  page: z.number().int().min(1).default(1).optional(),
  pageSize: z.number().int().min(1).max(100).default(20).optional(),
});
