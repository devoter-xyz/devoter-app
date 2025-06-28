import { z } from 'zod';

const userSchema = z.object({
  id: z.string(),
  walletAddress: z.string(),
  createdAt: z.date(),
  updatedAt: z.date()
});

const repositorySchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  title: z.string(),
  description: z.string(),
  githubUrl: z.string(),
  weekId: z.string(),
  totalVotes: z.number(),
  paymentId: z.string(),
  submitterId: z.string(),
  submitter: userSchema
});

export const GetRepositoriesInput = z.object({
  sortBy: z.enum(['createdAt', 'totalVotes']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  limit: z.number().min(1).max(100).default(10),
  page: z.number().min(1).default(1),
  week: z.string().optional()
});

export type GetRepositoriesOutput = {
  repositories: z.infer<typeof repositorySchema>[];
  total: number;
};
