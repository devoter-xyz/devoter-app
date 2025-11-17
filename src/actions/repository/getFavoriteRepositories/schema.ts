import { z } from 'zod';

export const getFavoriteRepositoriesSchema = z.object({
  pageSize: z.number().min(1).max(50).optional().default(10),
  page: z.number().min(1).optional().default(1)
});

export type GetFavoriteRepositoriesInput = z.infer<typeof getFavoriteRepositoriesSchema>;
