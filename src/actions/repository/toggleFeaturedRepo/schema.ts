import * as z from 'zod';

export const toggleFeaturedRepoSchema = z.object({
  repoId: z.string().uuid({ message: 'Please provide a valid repository ID' })
});

export type ToggleFeaturedRepoInput = z.infer<typeof toggleFeaturedRepoSchema>;
