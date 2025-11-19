import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { action } from "@/lib/safe-action";
import { z } from "zod";
import { getRepositoryAnalyticsLogic, RepositoryAnalytics } from "./logic";

const schema = z.object({
  repositoryId: z.string(),
});

export const getRepositoryAnalytics = action(schema, async ({ repositoryId }): Promise<RepositoryAnalytics> => {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Not authenticated.");
  }

  const repository = await prisma.repository.findUnique({
    where: {
      id: repositoryId,
    },
    select: {
      ownerId: true,
    },
  });

  if (!repository) {
    throw new Error("Repository not found.");
  }

  if (repository.ownerId !== session.user.id) {
    throw new Error("Unauthorized: You are not the owner of this repository.");
  }

  return getRepositoryAnalyticsLogic(repositoryId);
});
