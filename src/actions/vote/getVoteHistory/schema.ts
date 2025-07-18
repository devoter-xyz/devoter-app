import { z } from 'zod';

export const getVoteHistorySchema = z.object({});

export type GetVoteHistoryInput = z.infer<typeof getVoteHistorySchema>; 