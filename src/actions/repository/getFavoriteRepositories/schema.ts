import { z } from 'zod';

export const getFavoriteRepositoriesSchema = z.object({
  limit: z.number().min(1).max(50).optional().default(10),
  offset: z.number().min(0).optional().default(0)
});

export type GetFavoriteRepositoriesInput = z.infer<typeof getFavoriteRepositoriesSchema>;
