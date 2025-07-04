import { LeaderboardEntry } from '@/actions/leaderboard/getLeaderboard/logic';
import { LeaderboardCard } from '@/components/pages/leaderboard/components/LeaderboardCard';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getWeeks, type IsoWeek } from '@/lib/utils/date';
import Link from 'next/link';

type LeaderboardPageContentProps = {
  leaderboard: LeaderboardEntry[];
  weeks: IsoWeek[];
  currentWeek: IsoWeek;
  selectedWeek: IsoWeek;
  total: number;
  page: number;
  count: number;
};

export function LeaderboardPageContent({
  leaderboard,
  currentWeek,
  selectedWeek,
  page,
  count,
  total,
}: LeaderboardPageContentProps) {
  const weeks = getWeeks();
  const pastWeeks = weeks.filter((week) => week !== currentWeek);
  const isPastWeek = selectedWeek !== currentWeek;

  const totalPages = Math.ceil(total / count);

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Weekly Leaderboard</h1>
        <p className="text-muted-foreground mt-2">
          Vote for your favorite repositories for the{' '}
          {isPastWeek ? `week ${selectedWeek}` : 'current week'}.
        </p>

        <div className="mt-6 flex justify-center">
          <div className="flex flex-col items-start gap-4 mt-4">
            <Select value={selectedWeek}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select Past Week" />
              </SelectTrigger>
              <SelectContent>
                {pastWeeks.map((week) => (
                  <SelectItem key={week} value={week}>
                    <Link href={`/leaderboard?week=${week}`}>{week}</Link>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                className={page >= totalPages ? 'pointer-events-none text-gray-400' : ''}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
