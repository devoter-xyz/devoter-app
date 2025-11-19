import { prisma } from "@/lib/prisma";
import { FilterRepositoriesSchema } from "./schema";

export async function filterRepositoriesLogic(filters: FilterRepositoriesSchema) {
  const {
    tags,
    startDate,
    endDate,
    minVotes,
    maxVotes,
    org,
    maintainer,
    onlyFeatured,
  } = filters;

  const where: any = {};

  if (tags && tags.length > 0) {
    where.tags = {
      hasEvery: tags,
    };
  }

  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) {
      where.createdAt.gte = new Date(startDate);
    }
    if (endDate) {
      where.createdAt.lte = new Date(endDate);
    }
  }

  if (minVotes) {
    where.totalVotes = {
      gte: minVotes,
    };
  }

  if (maxVotes) {
    where.totalVotes = {
      ...(where.totalVotes || {}),
      lte: maxVotes,
    };
  }

  if (org) {
    where.owner = org;
  }

  if (maintainer) {
    where.maintainer = maintainer;
  }

  if (onlyFeatured) {
    where.isFeatured = true;
  }

  const repositories = await prisma.repository.findMany({
    where,
    include: {
      _count: {
        select: {
          votes: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    },
  });

  return repositories.map(repo => ({
    ...repo,
    totalVotes: repo._count.votes,
  }));
}
