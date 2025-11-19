import { z } from "zod";

export const filterRepositoriesSchema = z.object({
  tags: z.array(z.string()).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  minVotes: z.number().int().min(0).optional(),
  maxVotes: z.number().int().min(0).optional(),
});

export type FilterRepositoriesSchema = z.infer<typeof filterRepositoriesSchema>;
