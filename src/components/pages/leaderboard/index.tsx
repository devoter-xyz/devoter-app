'use client';

import { LeaderboardEntry } from '@/actions/leaderboard/getLeaderboard/logic';
import { LeaderboardCard } from '@/components/pages/leaderboard/components/LeaderboardCard';
import { useEffect, useState } from 'react';
import { getAvailableLeaderboardWeeksAction } from '@/actions/leaderboard/getLeaderboard/action';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

type LeaderboardPageContentProps = {
  leaderboard: LeaderboardEntry[];
};

export function LeaderboardPageContent({ leaderboard }: LeaderboardPageContentProps) {
  const [weeks, setWeeks] = useState<string[]>([]);
  const [selectedWeek, setSelectedWeek] = useState<string>('');

  useEffect(() => {
    async function fetchWeeks() {
      const result = await getAvailableLeaderboardWeeksAction();
      setWeeks(result);
      if (result.length > 0) setSelectedWeek(result[0]);
    }
    fetchWeeks();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Weekly Leaderboard</h1>
        <p className="text-muted-foreground mt-2">Vote for your favorite repositories for the current week.</p>
        {weeks.length > 0 && (
          <div className="mt-4 flex justify-center">
            <Select value={selectedWeek} onValueChange={setSelectedWeek}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select week" />
              </SelectTrigger>
              <SelectContent>
                {weeks.map(week => (
                  <SelectItem key={week} value={week}>{week}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
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
