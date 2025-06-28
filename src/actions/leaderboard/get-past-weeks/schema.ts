import { z } from 'zod';

export const GetPastWeeksOutputSchema = z.array(
  z.object({
    weekId: z.string(),
    topRepository: z
      .object({
        id: z.string(),
        title: z.string(),
        description: z.string(),
        githubUrl: z.string(),
        totalVotes: z.number(),
        submitter: z.object({
          walletAddress: z.string(),
        }),
      })
      .nullable(),
  })
);

export type GetPastWeeksOutput = z.infer<typeof GetPastWeeksOutputSchema>;
