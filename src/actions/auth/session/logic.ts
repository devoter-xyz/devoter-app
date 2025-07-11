import { prisma } from '@/lib/db';
import { User } from '@prisma/client';

export type GetUserFromSessionResult = Pick<User, 'id' | 'walletAddress'> | null;

export async function getUserFromSession(): Promise<GetUserFromSessionResult> {
  // FOR TESTING: Hardcode user
  const testUserId = "e44ed605-1df9-4d9f-9690-f6a7e3207c41";
  return await prisma.user.findUnique({
    where: { id: testUserId },
    select: {
      id: true,
      walletAddress: true,
    },
  });

  /*  Original logic
  const session = await getSession();
  if (!session) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      walletAddress: true,
    },
  });
  
  return user;
  */
}