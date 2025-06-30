'use client';

import { LeaderboardCard } from '@/components/pages/leaderboard/components/LeaderboardCard';

type Repository = {
  id: string;
  title: string;
  description: string | null;
  submitter: {
    walletAddress: string;
  };
  githubUrl: string;
  totalVotes: number;
};

type LeaderboardPageContentProps = {
  repositories: Repository[];
};

export function LeaderboardPageContent({ repositories }: LeaderboardPageContentProps) {
  return (
    <div className="container mx-auto p-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Weekly Leaderboard</h1>
        <p className="text-muted-foreground mt-2">Vote for your favorite repositories for the current week.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {repositories.map((repo, index) => (
          <LeaderboardCard
            key={repo.id}
            repository={{
              id: repo.id,
              name: repo.title,
              description: repo.description ?? '',
              author: repo.submitter.walletAddress,
              url: repo.githubUrl,
              votes: repo.totalVotes,
            }}
            rank={index + 1}
          />
        ))}
      </div>
    </div>
  );
}
