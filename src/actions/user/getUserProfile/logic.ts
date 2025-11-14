import { prisma } from "@/lib/prisma";

export async function getUserProfileLogic(walletAddress: string) {
  const user = await prisma.user.findUnique({
    where: { walletAddress },
    include: {
      repositories: {
        include: {
          user: true,
          _count: {
            select: {
              votes: true,
            },
          },
        },
      },
      votes: {
        include: {
          repository: {
            include: {
              user: true,
            },
          },
        },
      },
      favoriteRepositories: {
        include: {
          user: true,
          _count: {
            select: {
              votes: true,
            },
          },
        },
      },
    },
  });

  return user;
}
