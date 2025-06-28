import { LeaderboardPageContent } from '@/components/pages/leaderboard';

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center">
          <LeaderboardPageContent />
        </div>
      </main>
    </div>
  );
}
