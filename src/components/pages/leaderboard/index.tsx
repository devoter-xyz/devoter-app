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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination';

type LeaderboardPageContentProps = {
  leaderboard: LeaderboardEntry[];
  weeks: IsoWeek[];
  currentWeek: IsoWeek;
  selectedWeek: IsoWeek;
  total: number;
  page: number;
  pageSize: number;
};

export function LeaderboardPageContent({
  leaderboard,
  weeks,
  currentWeek,
  selectedWeek,
  total,
  page,
  pageSize
}: LeaderboardPageContentProps) {
  const router = useRouter();
  const totalPages = Math.ceil(total / pageSize);

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

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    router.push(`/leaderboard?week=${selectedWeek}&page=${newPage}`);
  };

  const pastWeeks = weeks.filter((week) => week !== currentWeek);

  const renderLeaderboard = () => (
    <>
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
                votes: repository.totalVotes
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
    </>
  );

  return (
    <div className="container mx-auto p-4 flex flex-col h-full">
      <div className="flex-grow">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight">Weekly Leaderboard</h1>
          <p className="text-muted-foreground mt-2">
            Vote for your favorite repositories for the{' '}
            {isPastWeek ? `week of ${selectedWeek}` : 'current week'}.
          </p>

          <div className="mt-6 flex justify-center">
            <Tabs value={tab} onValueChange={handleTabChange} className="w-full max-w-5xl">
              <TabsList>
                <TabsTrigger value="current">Current Week</TabsTrigger>
                <TabsTrigger value="past">Past Weeks</TabsTrigger>
              </TabsList>

              <TabsContent value="current">{renderLeaderboard()}</TabsContent>

              <TabsContent value="past">
                <div className="flex flex-col items-start gap-4 mt-4">
                  <Select
                    value={isPastWeek ? selectedWeek : undefined}
                    onValueChange={handleWeekChange}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Select Past Week" />
                    </SelectTrigger>
                    <SelectContent>
                      {pastWeeks.map(week => (
                        <SelectItem key={week} value={week}>
                          {week}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {isPastWeek ? (
                    renderLeaderboard()
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
      <div className="mt-8 py-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={e => {
                  e.preventDefault();
                  handlePageChange(page - 1);
                }}
                className={page <= 1 ? 'pointer-events-none text-gray-400' : ''}
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href={`/leaderboard?week=${selectedWeek}&page=${i + 1}`}
                  isActive={page === i + 1}
                  onClick={e => {
                    e.preventDefault();
                    handlePageChange(i + 1);
                  }}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={e => {
                  e.preventDefault();
                  handlePageChange(page + 1);
                }}
                className={page >= totalPages ? 'pointer-events-none text-gray-400' : ''}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
