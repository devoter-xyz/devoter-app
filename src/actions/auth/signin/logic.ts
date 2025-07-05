import { SignInPayload } from '@/actions/auth/signin/schema';
import { verifySiweSignature } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { setSessionCookie } from '@/lib/session';
import { User } from '@prisma/client';

export type SigninResult = Pick<User, 'id' | 'walletAddress'> | null;

export async function signIn(payload: SignInPayload): Promise<SigninResult> {
  const address = await verifySiweSignature(payload.message, payload.signature, payload.nonce);
  if (!address) {
    throw new Error('Invalid signature');
  }

  let user = await prisma.user.findUnique({
    where: { walletAddress: address },
    select: {
      id: true,
      walletAddress: true
    }
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        walletAddress: address
      },
      select: {
        id: true,
        walletAddress: true
      }
    });
  }

  await setSessionCookie({
    userId: user.id
  });

  return user;
}
