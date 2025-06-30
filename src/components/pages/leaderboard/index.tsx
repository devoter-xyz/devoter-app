'use client';

import { LeaderboardEntry } from '@/actions/leaderboard/getLeaderboard/logic';
import { LeaderboardCard } from '@/components/pages/leaderboard/components/LeaderboardCard';

type LeaderboardPageContentProps = {
  leaderboard: LeaderboardEntry[];
};

export function LeaderboardPageContent({ leaderboard }: LeaderboardPageContentProps) {
  return (
    <div className="container mx-auto p-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Weekly Leaderboard</h1>
        <p className="text-muted-foreground mt-2">Vote for your favorite repositories for the current week.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {leaderboard.map(({ repository, rank }) => (
          <LeaderboardCard
            key={repository.id}
            repository={{
              id: repository.id,
              name: repository.title,
              description: repository.description ?? '',
              author: repository.submitter.walletAddress,
              url: repository.githubUrl,
              votes: repository.totalVotes,
            }}
            rank={rank}
          />
        ))}
      </div>
    </div>
  );
}
