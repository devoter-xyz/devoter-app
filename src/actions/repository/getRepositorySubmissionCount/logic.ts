'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentWeek } from '@/lib/utils/date';

export const getRepositorySubmissionCount = async (userId: string) => {
  const currentWeek = getCurrentWeek();
  const submissionCount = await prisma.repository.count({
    where: {
      submitterId: userId,
      createdAt: {
        gte: currentWeek.start,
        lte: currentWeek.end
      }
    }
  });

  return { count: submissionCount };
};
