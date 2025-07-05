import { getLeaderboard } from '@/actions/leaderboard/getLeaderboard/logic';
import { LeaderboardPageContent } from '@/components/pages/leaderboard';
import { getWeeks, getWeek, type IsoWeek } from '@/lib/utils/date';

export const revalidate = 60;

export default async function LeaderboardPage({
  searchParams,
}: {
  searchParams: {
    week?: string;
  };
}) {
  const currentWeek = getWeek(new Date());
  const week = (searchParams.week as IsoWeek) || currentWeek;
  const leaderboard = await getLeaderboard({ week });
  const weeks = getWeeks();

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <LeaderboardPageContent
          leaderboard={leaderboard}
          weeks={weeks}
          currentWeek={currentWeek}
          selectedWeek={week}
        />
      </main>
    </div>
  );
}
