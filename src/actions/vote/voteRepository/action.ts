'use server';

import { authActionClient } from '@/lib/actions';
import { voteRepository } from './logic';
import { voteRepositorySchema } from './schema';
import { sendEmail } from '@/lib/email/emailService';
import { newVoteEmailTemplate } from '@/lib/email/templates/newVote';
import { prisma } from '@/lib/prisma';
import { getBaseUrl } from '@/lib/utils';

export const voteRepositoryAction = authActionClient
  .inputSchema(voteRepositorySchema)
  .action(async ({ parsedInput, ctx }) => {
    await voteRepository(parsedInput, ctx.session.userId);

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
            voteAmount: parsedInput.tokenAmount.toString(),
            repositoryUrl,
          }),
        });
      }
    }

    return { success: true };
  });
