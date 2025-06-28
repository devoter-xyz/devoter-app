import { getArchivedLeaderboardAction } from './action';
import { z } from 'zod';

export type GetArchivedLeaderboardOutput = z.infer<typeof getArchivedLeaderboardAction._outputSchema>;
