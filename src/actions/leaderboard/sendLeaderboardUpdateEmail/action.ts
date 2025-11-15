import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email/emailService';
import { leaderboardUpdateEmailTemplate } from '@/lib/email/templates/leaderboardUpdate';
import { getBaseUrl } from '@/lib/utils';

export async function sendLeaderboardUpdateEmails() {
  const usersToNotify = await prisma.user.findMany({
    where: {
      notificationPreferences: {
        leaderboardNotification: true,
      },
      email: { not: null },
    },
    include: {
      notificationPreferences: true,
    },
  });

  // For now, let's fetch some top repos. In a real scenario, this would come from a pre-calculated leaderboard.
  const topRepos = await prisma.repository.findMany({
    where: { weeklyRank: { not: null } },
    orderBy: { weeklyRank: 'asc' },
    take: 5,
    select: { id: true, title: true, weeklyRank: true },
  });

  const leaderboardUrl = `${getBaseUrl()}/leaderboard`;

  for (const user of usersToNotify) {
    if (user.email) {
      const reposForEmail = topRepos.map(repo => ({
        title: repo.title || 'Untitled Repository',
        rank: repo.weeklyRank || 0,
        url: `${getBaseUrl()}/repository/${repo.id}`,
      }));

      await sendEmail({
        to: user.email,
        subject: 'Your Weekly Devoter Leaderboard Update!',
        html: leaderboardUpdateEmailTemplate({
          userName: user.name || 'there',
          leaderboardUrl,
          topRepos: reposForEmail,
        }),
      });
    }
  }
  return { success: true, message: `Sent leaderboard updates to ${usersToNotify.length} users.` };
}
