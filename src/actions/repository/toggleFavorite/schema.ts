import * as z from 'zod';

export const toggleFavoriteSchema = z.object({
  repositoryId: z.string().uuid({ message: 'Please provide a valid repository ID' })
});

export type ToggleFavoriteInput = z.infer<typeof toggleFavoriteSchema>;
