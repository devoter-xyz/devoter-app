import { prisma } from '@/lib/db';
import { getSession } from '@/lib/session';
import { createSafeActionClient } from 'next-safe-action';
import { headers } from 'next/headers';

export const actionClientBase = createSafeActionClient();

export const actionClient = actionClientBase
  /**
   * Middleware used for auth purposes.
   * Returns the context with the session object.
   */
  .use(async ({ next }) => {
    const session = await getSession();
    const headerList = await headers();

    return next({
      ctx: { session, headers: headerList }
    });
  });

export const authActionClient = actionClient.use(async ({ next, ctx }) => {
  const session = ctx.session;

  if (!session) {
    throw new Error('You are not logged in. Please try to login');
  }

  const userId = session?.userId;

  if (!userId) {
    throw new Error('You are not logged in. Please try to login');
  }

  await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: { id: true }
  });

  return next({ ctx: { ...ctx, session: { ...ctx.session, userId } } });
});

export const adminActionClient = authActionClient.use(async ({ next, ctx }) => {
  const userId = ctx.session.userId;

  const admin = await prisma.adminUser.findUnique({
    where: { id: userId }
  });

  if (!admin) {
    throw new Error('You do not have permission to perform this action');
  }

  return next({ ctx });
});
