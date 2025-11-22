import { NetworkError, ValidationError } from '@/lib/errors';
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

const userProfileInclude = Prisma.validator<Prisma.UserDefaultArgs>()({
  include: {
    repositories: {
      include: {
        submitter: true,
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
            submitter: true,
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
    throw new ValidationError("Invalid wallet address provided.");
  }

  try {
    const user = await prisma.user.findUnique({
      where: { walletAddress },
      ...userProfileInclude,
    });

    return user;
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
    throw new NetworkError("Failed to fetch user profile.");
  }
}
