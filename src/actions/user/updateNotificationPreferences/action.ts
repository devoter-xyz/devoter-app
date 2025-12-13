import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const updateNotificationPreferencesSchema = z.object({
  newVoteNotification: z.boolean().optional(),
  leaderboardNotification: z.boolean().optional(),
  newRepoNotification: z.boolean().optional(),
  favoriteTagNotification: z.boolean().optional(),
});

export async function updateNotificationPreferences(formData: FormData) {
  const session = await getSession();

  if (!session?.userId) {
    throw new Error('Unauthorized');
  }

  const data = Object.fromEntries(formData.entries());
  const parsed = updateNotificationPreferencesSchema.parse({
    newVoteNotification: data.newVoteNotification === 'on',
    leaderboardNotification: data.leaderboardNotification === 'on',
    newRepoNotification: data.newRepoNotification === 'on',
    favoriteTagNotification: data.favoriteTagNotification === 'on',
  });

  try {
    await prisma.notificationPreference.upsert({
      where: { userId: session.userId },
      update: parsed,
      create: {
        userId: session.userId,
        ...parsed,
      },
    });
    revalidatePath('/dashboard'); // Or wherever the preferences are displayed
    return { success: true };
  } catch (error) {
    console.error('Failed to update notification preferences:', error);
    return { success: false, error: 'Failed to update preferences' };
  }
}
