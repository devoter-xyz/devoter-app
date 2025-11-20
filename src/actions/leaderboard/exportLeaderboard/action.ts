import { z } from 'zod';
import { protectedAction } from '@/lib/actions';
import { exportLeaderboardLogic } from './logic';

export const exportLeaderboard = protectedAction
  .input(
    z.object({
      format: z.enum(['csv', 'json']),
      week: z.string(),
    }),
  )
  .output(z.string()) // Returns a base64 encoded string of the file content
  .handler(async ({ input }) => {
    const { format, week } = input;
    const fileContent = await exportLeaderboardLogic(format, week);
    return fileContent;
  });
