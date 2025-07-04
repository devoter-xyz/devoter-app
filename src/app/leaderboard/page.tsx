import { getLeaderboard } from '@/actions/leaderboard/getLeaderboard/logic';
import { LeaderboardPageContent } from '@/components/pages/leaderboard';
import { getWeeks, getWeek } from '@/lib/utils/date';

export const revalidate = 60;

export default async function LeaderboardPage() {
  const week = getWeek(new Date());
  const leaderboard = await getLeaderboard({ week });
  const weeks = getWeeks();

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <LeaderboardPageContent 
          leaderboard={leaderboard} 
          weeks={weeks} 
        />
      </main>
    </div>
  );
}
