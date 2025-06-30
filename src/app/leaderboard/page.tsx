import { getRepositoriesAction } from '@/actions/repository/GetRepositories/action';
import { LeaderboardPageContent } from '@/components/pages/leaderboard';
import { getWeek } from '@/lib/utils';

export const revalidate = 60;

export default async function LeaderboardPage() {
  const week = getWeek(new Date());
  const { data } = await getRepositoriesAction({ week });
  const repositories = data?.repositories ?? [];

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <LeaderboardPageContent repositories={repositories} />
      </main>
    </div>
  );
}
