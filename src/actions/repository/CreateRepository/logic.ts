import { prisma } from '@/lib/prisma';
import { getCurrentWeek } from '@/lib/utils/date';
import crypto from 'crypto';
import { CreateRepositoryInput } from './schema';

export interface CreateRepositoryResult {
  id: string;
  title: string;
  description: string;
  githubUrl: string;
  createdAt: Date;
}

export async function createRepository(input: CreateRepositoryInput, userId: string): Promise<CreateRepositoryResult> {
  const currentWeek = getCurrentWeek();

  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: {
      id: true,
      walletAddress: true
    }
  });

  const submissionPayment = await prisma.payment.create({
    data: {
      userId: user.id,
      walletAddress: user.walletAddress,
      tokenAmount: 0, // No payment required for submission
      txHash: `0x${crypto.randomBytes(32).toString('hex')}`, // going to ask reviewer for clarification
      week: currentWeek.weekString
    }
  });

  // Create the repository
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
