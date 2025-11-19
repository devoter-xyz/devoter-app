import { z } from "zod";

export const filterRepositoriesSchema = z.object({
  tags: z.array(z.string()).optional(),
  startDate: z.string().date().optional(),
  endDate: z.string().date().optional(),
  minVotes: z.number().int().min(0).optional(),
  maxVotes: z.number().int().min(0).optional(),
  org: z.string().optional(),
  maintainer: z.string().optional(),
  onlyFeatured: z.boolean().optional(),
});

export type FilterRepositoriesSchema = z.infer<typeof filterRepositoriesSchema>;
