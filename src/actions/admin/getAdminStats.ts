
'use server';

import { prisma } from '@/lib/prisma';

export async function getAdminStats() {
  // TODO: Implement admin authentication/authorization

  const totalUsers = await prisma.user.count();
  const totalRepositories = await prisma.repository.count();
  const flaggedRepositories = await prisma.repository.count({
    where: {

    },
  });

  return {
    totalUsers,
    totalRepositories,
    flaggedRepositories,
  };
}
