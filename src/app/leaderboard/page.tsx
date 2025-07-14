import { getLeaderboard } from '@/actions/leaderboard/getLeaderboard/logic';
import { getVotesByUser } from '@/actions/vote/getVotesByUser/logic';
import { LeaderboardPageContent } from '@/components/pages/leaderboard';
import { getWeek, getWeeks, type IsoWeek } from '@/lib/utils/date';
import { getUserFromSession } from '@/actions/auth/session/logic';

export const revalidate = 60;

export default async function LeaderboardPage({
  searchParams
}: {
  searchParams: Promise<{
    week?: string;
    page?: string;
  }>;
}) {
  const { week: weekParam, page: pageParam } = await searchParams;
  const currentPage = pageParam ? parseInt(pageParam, 10) : 1;
  const currentWeek = getWeek(new Date());
  const week = (weekParam as IsoWeek) || currentWeek;
  const { leaderboard, total } = await getLeaderboard({
    week,
    page: currentPage,
    pageSize: 10
  });
  const weeks = getWeeks();
  const user = await getUserFromSession();
  const userVotes = user
    ? await getVotesByUser(
        {
          week
        },
        user.id
      )
    : [];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 w-full flex-grow">
        <LeaderboardPageContent
          leaderboard={leaderboard}
          weeks={weeks}
          currentWeek={currentWeek}
          selectedWeek={week}
          total={total}
          page={currentPage}
          count={10}
          userVotes={userVotes}
        />
      </main>
    </div>
  );
}
