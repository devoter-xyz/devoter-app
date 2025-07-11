import { prisma } from '@/lib/db';
import { getSession } from '@/lib/session';
import { User } from '@prisma/client';

export type GetUserFromSessionResult = Pick<User, 'id' | 'walletAddress'> | null;

export async function getUserFromSession(): Promise<GetUserFromSessionResult> {

  const session = await getSession();
  if (!session) {
    return null;
  }

  return await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      walletAddress: true,
    },
  });
}