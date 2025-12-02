import { prisma } from "@/lib/prisma";
import { authActionClient } from "@/lib/actions";
import { z } from "zod";
import { getRepositoryAnalyticsLogic, RepositoryAnalytics } from "./logic";

const schema = z.object({
  repositoryId: z.string(),
});

export const getRepositoryAnalytics = authActionClient.action(schema, async ({ parsedInput: { repositoryId }, ctx: { session } }): Promise<RepositoryAnalytics> => {

  if (!session?.userId) {
    throw new Error("Not authenticated.");
  }

  const repository = await prisma.repository.findUnique({
    where: {
      id: repositoryId,
    },
    select: {
      submitterId: true,
    },
  });

  if (!repository) {
    throw new Error("Repository not found.");
  }

  if (repository.submitterId !== session.userId) {
    throw new Error("Unauthorized: You are not the owner of this repository.");
  }

  return getRepositoryAnalyticsLogic(repositoryId);
});
