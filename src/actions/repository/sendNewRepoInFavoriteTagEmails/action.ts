import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email/emailService';
import { newRepoInFavoriteTagEmailTemplate } from '@/lib/email/templates/newRepoInFavoriteTag';
import { getBaseUrl } from '@/lib/utils';

export async function sendNewRepoInFavoriteTagEmails() {
  const usersToNotify = await prisma.user.findMany({
    where: {
      notificationPreferences: {
        newRepoNotification: true,
        favoriteTagNotification: true,
      },
      email: { not: null },
    },
    include: {
      notificationPreferences: true,
      favorites: {
        select: { repository: { select: { tags: true } } },
      },
    },
  });

  // Calculate a date for "new" repositories, e.g., last 24 hours
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const newRepositories = await prisma.repository.findMany({
    where: {
      createdAt: { gte: twentyFourHoursAgo },
    },
    select: { id: true, title: true, description: true, tags: true },
  });

  for (const user of usersToNotify) {
    if (user.email) {
      const userFavoriteTags = new Set<string>();
      user.favorites.forEach(fav => {
        fav.repository.tags.forEach(tag => userFavoriteTags.add(tag));
      });

      const relevantNewRepos = newRepositories.filter(repo =>
        repo.tags.some(tag => userFavoriteTags.has(tag))
      );

      for (const repo of relevantNewRepos) {
        const repositoryUrl = `${getBaseUrl()}/repository/${repo.id}`;
        // Find the first matching tag to use in the email subject/body
        const matchingTag = repo.tags.find(tag => userFavoriteTags.has(tag));

        if (matchingTag) {
          await sendEmail({
            to: user.email,
            subject: `New Repository in Your Favorite Tag: ${matchingTag}`,
            html: newRepoInFavoriteTagEmailTemplate({
              userName: user.name || 'there',
              tagName: matchingTag,
              repositoryTitle: repo.title,
              repositoryUrl,
              repositoryDescription: repo.description,
            }),
          });
        }
      }
    }
  }
  return { success: true, message: `Sent new repository updates to ${usersToNotify.length} users.` };
}
