import { z } from 'zod';

export const toggleFavoriteRepositorySchema = z.object({
  repositoryId: z.string().uuid()
});

export type ToggleFavoriteRepositoryInput = z.infer<typeof toggleFavoriteRepositorySchema>;
