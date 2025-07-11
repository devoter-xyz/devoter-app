import { z } from 'zod';

export const voteRepositorySchema = z.object({
  repositoryId: z.string(),
});

export type VoteRepositoryInput = z.infer<typeof voteRepositorySchema>; 