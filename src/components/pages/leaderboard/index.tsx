'use client';

import ErrorBoundary from '@/components/ErrorBoundary';
import ErrorFallback from '@/components/common/ErrorFallback';
import { LeaderboardEntry } from '@/actions/leaderboard/getLeaderboard/logic';
import { exportLeaderboard } from '@/actions/leaderboard/exportLeaderboard/action';
import { LeaderboardCard } from '@/components/pages/leaderboard/components/LeaderboardCard';
import { WeekSelector } from '@/components/pages/leaderboard/components/WeekSelector';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { type IsoWeek } from '@/lib/utils/date';
import { useState } from 'react';

type LeaderboardPageContentProps = {
  leaderboard: LeaderboardEntry[];
  weeks: IsoWeek[];
  currentWeek: IsoWeek;
  selectedWeek: IsoWeek;
  total: number;
  page: number;
  count: number;
  userVotes: string[];
};

export function LeaderboardPageContent({
  leaderboard,
  weeks,
  currentWeek,
  selectedWeek,
  page,
  count,
  total,
  userVotes = []
}: LeaderboardPageContentProps) {
  const isPastWeek = selectedWeek !== currentWeek;
  const totalPages = Math.ceil(total / count);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: 'csv' | 'json') => {
    setIsExporting(true);
    try {
      const fileContentBase64 = await exportLeaderboard({ format, week: selectedWeek });
      const fileName = `leaderboard-${selectedWeek}.${format}`;
      const decodedFileContent = Buffer.from(fileContentBase64, 'base64').toString('utf8');
      const blob = new Blob([decodedFileContent], { type: format === 'csv' ? 'text/csv' : 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export leaderboard:', error);
      alert('Failed to export leaderboard. Please try again later.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <ErrorBoundary fallback={<ErrorFallback error={new Error("Failed to load leaderboard.")} />}>
      <div className="container mx-auto p-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight">Weekly Leaderboard</h1>
          <p className="text-muted-foreground mt-2">
            Vote for your favorite repositories for the{' '}
            {isPastWeek ? `week ${selectedWeek}` : 'current week'}.
          </p>

          <div className="mt-6">
            <div className="flex flex-col items-start gap-4 mt-4">
              <div className="flex items-center gap-4">
                <WeekSelector weeks={weeks} currentWeek={currentWeek} selectedWeek={selectedWeek} />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" disabled={isExporting}>
                      {isExporting ? 'Exporting...' : 'Export'}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleExport('csv')}>Export as CSV</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExport('json')}>Export as JSON</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <>
                {leaderboard.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
                    {leaderboard.map(({ repository, rank }) => (
                      <LeaderboardCard
                        key={repository.id}
                        repository={repository}
                        rank={rank}
                        hasVoted={userVotes.includes(repository.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 mt-6">
                    No leaderboard data found for the week.
                  </div>
                )}
              </>
            </div>
          </div>
        </div>
        <div className="mt-8 py-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href={`/leaderboard?week=${selectedWeek}&page=${page - 1}`}
                  className={page <= 1 ? 'pointer-events-none text-gray-400' : ''}
                />
              </PaginationItem>
              {[...Array(totalPages)].map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    href={`/leaderboard?week=${selectedWeek}&page=${i + 1}`}
                    isActive={page === i + 1}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href={`/leaderboard?week=${selectedWeek}&page=${page + 1}`}
                  className={page >= totalPages ? 'pointer-events-none text-gray-400' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </ErrorBoundary>
  );
}
