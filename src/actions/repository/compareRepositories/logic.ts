import { prisma } from "@/lib/prisma";
import { Repository } from "@prisma/client";

export async function getRepositoriesForComparison(repositoryIds: string[]): Promise<Repository[]> {
  if (!repositoryIds || repositoryIds.length === 0) {
    return [];
  }

  const repositories = await prisma.repository.findMany({
    where: {
      id: {
        in: repositoryIds,
      },
    },
    include: {
      votes: true, // Include votes to calculate voting trends
    },
  });

  return repositories;
}
