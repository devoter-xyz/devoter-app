'use client';

import { LeaderboardEntry } from '@/actions/leaderboard/getLeaderboard/logic';
import { LeaderboardCard } from '@/components/pages/leaderboard/components/LeaderboardCard';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { IsoWeek } from '@/lib/utils/date';

type LeaderboardPageContentProps = {
  leaderboard: LeaderboardEntry[];
  weeks: IsoWeek[];
  currentWeek: IsoWeek;
  selectedWeek: IsoWeek;
};

export function LeaderboardPageContent({
  leaderboard,
  weeks,
  currentWeek,
  selectedWeek,
}: LeaderboardPageContentProps) {
  const router = useRouter();

  const isPastWeek = selectedWeek !== currentWeek;
  const [tab, setTab] = useState<'current' | 'past'>(isPastWeek ? 'past' : 'current');

  const handleWeekChange = (week: string) => {
    router.push(`/leaderboard?week=${week}`);
  };

  const handleTabChange = (v: string) => {
    const newTab = v as 'current' | 'past';
    setTab(newTab);
    if (newTab === 'current') {
      router.push(`/leaderboard?week=${currentWeek}`);
    }
  };

  const pastWeeks = weeks.filter((week) => week !== currentWeek);

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Weekly Leaderboard</h1>
        <p className="text-muted-foreground mt-2">
          Vote for your favorite repositories for the{' '}
          {isPastWeek ? `week ${selectedWeek}` : 'current week'}.
        </p>

        <div className="mt-6 flex justify-center">
          <Tabs value={tab} onValueChange={handleTabChange} className="w-full max-w-5xl">
            <TabsList>
              <TabsTrigger value="current">Current Week</TabsTrigger>
              <TabsTrigger value="past">Past Weeks</TabsTrigger>
            </TabsList>

            <TabsContent value="current">
              {leaderboard.length > 0 ? (
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
              ) : (
                <div className="text-sm text-gray-500 mt-6">
                  No leaderboard data found for the current week.
                </div>
              )}
            </TabsContent>

            <TabsContent value="past">
              <div className="flex flex-col items-start gap-4 mt-4">
                <Select value={isPastWeek ? selectedWeek : undefined} onValueChange={handleWeekChange}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select Past Week" />
                  </SelectTrigger>
                  <SelectContent>
                    {pastWeeks.map((week) => (
                      <SelectItem key={week} value={week}>
                        {week}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {isPastWeek && leaderboard.length > 0 ? (
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
                ) : (
                  <div className="text-sm text-gray-500">
                    No leaderboard data found for this week.
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
