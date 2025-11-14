import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

const userProfileInclude = Prisma.validator<Prisma.UserDefaultArgs>()({
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

export type UserProfileResult = Prisma.UserGetPayload<typeof userProfileInclude>;

export async function getUserProfileLogic(
  walletAddress: string,
): Promise<UserProfileResult | null> {
  if (!walletAddress || typeof walletAddress !== "string") {
    throw new Error("Invalid wallet address provided.");
  }

  try {
    const user = await prisma.user.findUnique({
      where: { walletAddress },
      ...userProfileInclude,
    });

    return user;
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
    throw new Error("Failed to fetch user profile.");
  }
}
