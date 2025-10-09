import { prisma } from '@/lib/prisma';
import { getCurrentWeek } from '@/lib/utils/date';
import crypto from 'crypto';
import { getRepositorySubmissionCount } from '../getRepositorySubmissionCount/logic';
import { CreateRepositoryInput } from './schema';
import { DuplicateRepositoryError, WeeklySubmissionLimitError, InvalidGitHubUrlError } from '@/lib/errors';

export interface CreateRepositoryResult {
  id: string;
  title: string;
  description: string;
  githubUrl: string;
  createdAt: Date;
}

export async function createRepository(
  input: CreateRepositoryInput & { tokenAmount?: number },
  userId: string
): Promise<CreateRepositoryResult> {
  const currentWeek = getCurrentWeek();

  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: {
      id: true,
      walletAddress: true
    }
  });

  const { count } = await getRepositorySubmissionCount(userId);

  if (count >= 3) {
    throw new WeeklySubmissionLimitError();
  }

  // Validate GitHub URL
  const githubUrlRegex = /^(https?://)?(www\.)?github\.com/[a-zA-Z0-9-]+/[a-zA-Z0-9.-]+/?$/;
  if (!githubUrlRegex.test(input.githubUrl)) {
    throw new InvalidGitHubUrlError();
  }

  // Check for duplicate repository
  const existingRepository = await prisma.repository.findUnique({
    where: { githubUrl: input.githubUrl },
  });

  if (existingRepository) {
    throw new DuplicateRepositoryError();
  }

  const submissionPayment = await prisma.payment.create({
    data: {
      userId: user.id,
      walletAddress: user.walletAddress,
      tokenAmount: input.tokenAmount || 0,
      txHash: `0x${crypto.randomBytes(32).toString('hex')}`,
      week: currentWeek.weekString
    }
  });

  const repository = await prisma.repository.create({
    data: {
      title: input.title,
      description: input.description,
      githubUrl: input.githubUrl,
      submitterId: user.id,
      paymentId: submissionPayment.id
    },
    select: {
      id: true,
      title: true,
      description: true,
      githubUrl: true,
      createdAt: true
    }
  });

  return repository;
}
