'use server';

import { authActionClient } from '@/lib/actions';
import { voteRepository } from './logic';
import { voteRepositorySchema } from './schema';
import { sendEmail } from '@/lib/email/emailService';
import { newVoteEmailTemplate } from '@/lib/email/templates/newVote';
import { prisma } from '@/lib/prisma';
import { getBaseUrl } from '@/lib/utils';
import { checkRateLimit } from '@/lib/rateLimit'; // Import checkRateLimit

const VOTE_RATE_LIMIT_OPTIONS = {
  limit: 10, // 10 votes
  window: 3600, // per hour
};

export const voteRepositoryAction = authActionClient
  .inputSchema(voteRepositorySchema)
  .action(async ({ parsedInput, ctx }) => {
    const userId = ctx.session.userId;

    const allowed = await checkRateLimit('vote_repository', userId, VOTE_RATE_LIMIT_OPTIONS);

    if (!allowed) {
      throw new Error('Rate limit exceeded for voting. Please try again in an hour.');
    }

    const { tokenAmount } = await voteRepository(parsedInput, userId);

    // Fetch repository and owner details for email notification
    const repository = await prisma.repository.findUnique({
      where: { id: parsedInput.repositoryId },
      include: {
        submitter: {
          include: {
            notificationPreferences: true,
          },
        },
      },
    });

    if (repository?.submitter.email && repository.submitter.notificationPreferences?.newVoteNotification) {
      const voter = await prisma.user.findUnique({
        where: { id: ctx.session.userId },
      });

      if (voter) {
        const repositoryUrl = `${getBaseUrl()}/repository/${repository.id}`;
        await sendEmail({
          to: repository.submitter.email,
          subject: `New Vote on Your Repository: ${repository.title}`,
          html: newVoteEmailTemplate({
            userName: repository.submitter.name || 'there',
            repositoryTitle: repository.title,
            voterName: voter.name || 'Someone',
            voteAmount: tokenAmount.toString(),
            repositoryUrl,
          }),
        });
      }
    }

    return { success: true };
  });
