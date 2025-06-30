import z from 'zod';

export const getRepositoriesSchema = z.object({
  week: z.string().optional()
});

export type GetRepositoriesInput = z.infer<typeof getRepositoriesSchema>;
