'use client';

import { LeaderboardEntry } from '@/actions/leaderboard/getLeaderboard/logic';
import { LeaderboardCard } from '@/components/pages/leaderboard/components/LeaderboardCard';
import { getLeaderboardAction } from '@/actions/leaderboard/getLeaderboard/action';
import { useState, useTransition } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SkeletonCard } from '@/components/ui/skeleton';
import { getWeek } from '@/lib/utils/date';
import type { IsoWeek } from '@/lib/utils/date';

type LeaderboardPageContentProps = {
  leaderboard: LeaderboardEntry[];
  weeks: IsoWeek[];
};

export function LeaderboardPageContent({ leaderboard, weeks }: LeaderboardPageContentProps) {
  const currentWeek = getWeek(new Date());
  const [selectedWeek, setSelectedWeek] = useState<string>('');
  const [tab, setTab] = useState<'current' | 'past'>('past');
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [isPending, startTransition] = useTransition();

  const handleWeekChange = (week: string) => {
    setSelectedWeek(week);
    startTransition(async () => {
      const result = await getLeaderboardAction({ week });
      setLeaderboardData(result.data ?? []);
    });
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Weekly Leaderboard</h1>
        <p className="text-muted-foreground mt-2">
          Vote for your favorite repositories for the current week.
        </p>

        <div className="mt-6 flex justify-center">
          <Tabs
            defaultValue="current"
            value={tab}
            onValueChange={(v) => setTab(v as 'current' | 'past')}
            className="w-full max-w-2xl"
          >
            <TabsList>
              <TabsTrigger value="current">Current Week</TabsTrigger>
              <TabsTrigger value="past">Past Weeks</TabsTrigger>
            </TabsList>

            <TabsContent value="current">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
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
            </TabsContent>

            <TabsContent value="past">
              <div className="flex flex-col items-start gap-4 mt-4">
                <Select value={selectedWeek} onValueChange={handleWeekChange}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select Past Week" />
                  </SelectTrigger>
                  <SelectContent>
                    {weeks
                      .filter((week) => week !== currentWeek)
                      .map((week) => (
                        <SelectItem key={week} value={week}>
                          {week}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>

                {isPending && (
                  <SkeletonCard />
                )}

                {!isPending && leaderboardData.length > 0 && (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {leaderboardData.map(({ repository, rank }) => (
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
                )}

                {!isPending && selectedWeek && leaderboardData.length === 0 && (
                  <div className="text-sm text-gray-500">No leaderboard data found for this week.</div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
