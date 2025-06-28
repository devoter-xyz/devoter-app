'use client';

import { getRepositoriesAction } from '@/actions/repository/GetRepositories/action';
import { GetRepositoriesOutput } from '@/actions/repository/GetRepositories/schema';
import { getArchivedLeaderboardAction } from '@/actions/leaderboard/get-archived-leaderboard/action';
import { GetArchivedLeaderboardOutput } from '@/actions/leaderboard/get-archived-leaderboard/schema';
import { RepositoryCard } from '@/components/common/Repository/RepositoryCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAction } from 'next-safe-action/hooks';
import { useEffect, useState, useRef } from 'react';

// Helper function to get the week in 'YYYY-Www' format
const getWeekId = (date: Date): string => {
  const year = date.getUTCFullYear();
  // ISO 8601 week number logic
  const d = new Date(Date.UTC(year, date.getUTCMonth(), date.getUTCDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return `${year}-W${String(weekNo).padStart(2, '0')}`;
};

export function LeaderboardPageContent() {
  const [sortBy, setSortBy] = useState<'createdAt' | 'votes'>('votes');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [activeTab, setActiveTab] = useState<'current' | 'past'>('current');
  const [selectedWeek, setSelectedWeek] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);
  const limit = 50;

  const { execute: executeGetRepositories, result: resultRepositories, status: statusRepositories } = useAction(getRepositoriesAction);
  const { execute: executeGetArchived, result: resultArchived, status: statusArchived } = useAction(getArchivedLeaderboardAction);

  const isExecuting = statusRepositories === 'executing' || statusArchived === 'executing';
  const savedCallback = useRef(() => {});

  useEffect(() => {
    savedCallback.current = () => {
      if (!isExecuting) {
        if (activeTab === 'current') {
          const week = getWeekId(new Date());
          executeGetRepositories({ sortBy, sortOrder, page, limit, week });
        } else if (selectedWeek) {
          executeGetArchived({ week: selectedWeek });
        }
      }
    };
  }, [sortBy, sortOrder, activeTab, isExecuting, executeGetRepositories, executeGetArchived, page, limit, selectedWeek]);

  // Fetch data on mount/filter/page change
  useEffect(() => {
    savedCallback.current();
  }, [sortBy, sortOrder, activeTab, page, selectedWeek]);

  // Set up polling for current week
  useEffect(() => {
    if (activeTab === 'current') {
      const intervalId = setInterval(() => savedCallback.current(), 5000); // Poll every 5 seconds
      return () => clearInterval(intervalId);
    }
  }, [activeTab]);

  const { total = 0, repositories = [] } = (resultRepositories.data as unknown as GetRepositoriesOutput) ?? {};
  const archivedLeaderboard = (resultArchived.data as GetArchivedLeaderboardOutput) ?? [];
  const totalPages = activeTab === 'current' ? Math.ceil(total / limit) : 1;

  const renderRepositories = () => {
    if (activeTab === 'current') {
      return repositories.map((repo, index) => (
        <RepositoryCard
          key={repo.id}
          repository={{
            id: repo.id,
            name: repo.title,
            description: repo.description,
            author: repo.submitter.walletAddress,
            url: repo.githubUrl,
            votes: repo.totalVotes,
          }}
          rank={(page - 1) * limit + index + 1}
        />
      ));
    }

    return archivedLeaderboard.map((entry: GetArchivedLeaderboardOutput[number]) => (
      <RepositoryCard
        key={entry.id}
        repository={{
          id: entry.repository.id,
          name: entry.repository.title,
          description: entry.repository.description,
          author: entry.repository.submitter.walletAddress,
          url: entry.repository.githubUrl,
          votes: entry.repository.totalVotes, // This will be the total votes, not week-specific
        }}
        rank={entry.rank}
      />
    ));
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Weekly Leaderboard</h1>
        <p className="text-muted-foreground mt-2">Vote for your favorite repositories.</p>
      </div>

      <div className="flex justify-center">
        <Tabs
          value={activeTab}
          onValueChange={(value) => {
            setActiveTab(value as 'current' | 'past');
            setPage(1);
          }}
          className="w-[400px]"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="current">Current Week</TabsTrigger>
            <TabsTrigger value="past">Past Weeks</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {activeTab === 'past' && (
        <div className="mb-6 mt-6 flex items-center justify-center">
          <select
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(e.target.value)}
            className="rounded-md border-gray-300 bg-white p-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Select a week</option>
            {/* TODO: Populate with actual past weeks */}
            <option value="2024-W23">Week 23, 2024</option>
            <option value="2024-W22">Week 22, 2024</option>
          </select>
        </div>
      )}

      <div className="mb-6 mt-6 flex items-center justify-center gap-4">
        <div className="flex items-center gap-2">
          <label htmlFor="sortBy" className="text-sm font-medium">Sort By:</label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value as 'createdAt' | 'votes');
              setPage(1);
            }}
            className="rounded-md border-gray-300 bg-white p-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            disabled={activeTab === 'past'}
          >
            <option value="votes">Votes</option>
            <option value="createdAt">Date Submitted</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="sortOrder" className="text-sm font-medium">Order:</label>
          <select
            id="sortOrder"
            value={sortOrder}
            onChange={(e) => {
              setSortOrder(e.target.value as 'asc' | 'desc');
              setPage(1);
            }}
            className="rounded-md border-gray-300 bg-white p-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            disabled={activeTab === 'past'}
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>

      {isExecuting && <p className="text-center">Loading...</p>}
      {!isExecuting && (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {renderRepositories()}
          </div>
          {totalPages > 1 && activeTab === 'current' && (
            <div className="mt-8 flex justify-center gap-4">
              <Button onClick={() => setPage(page - 1)} disabled={page <= 1}>
                Previous
              </Button>
              <span className="flex items-center">
                Page {page} of {totalPages}
              </span>
              <Button onClick={() => setPage(page + 1)} disabled={page >= totalPages}>
                Next
              </Button>
            </div>
          )}
        </>
      )}
      {(statusRepositories === 'hasErrored' || statusArchived === 'hasErrored') && <p className="text-center text-red-500">Error loading repositories.</p>}
    </div>
  );
}
