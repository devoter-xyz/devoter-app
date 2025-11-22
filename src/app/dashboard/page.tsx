import ErrorBoundary from '@/components/ErrorBoundary';
import ErrorFallback from '@/components/common/ErrorFallback';
import React from 'react';

export default function DashboardPage() {
  return (
    <ErrorBoundary fallback={<ErrorFallback error={new Error("Failed to load dashboard content.")} />}>
      <section className='py-10 px-6'>
        <h1 className='text-3xl font-bold mb-6'>Dashboard</h1>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          <div className='bg-white dark:bg-zinc-900 rounded-xl shadow p-6 flex flex-col gap-2'>
            <h2 className='text-xl font-semibold'>Welcome!</h2>
            <p className='text-muted-foreground'>This is your dashboard. Add widgets, stats, or quick links here.</p>
          </div>
          <div className='bg-white dark:bg-zinc-900 rounded-xl shadow p-6 flex flex-col gap-2'>
            <h2 className='text-xl font-semibold'>Quick Links</h2>
            <ul className='list-disc ml-5 text-muted-foreground'>
              <li>Favorites</li>
              <li>Leaderboard</li>
              <li>API Access</li>
            </ul>
          </div>
          <div className='bg-white dark:bg-zinc-900 rounded-xl shadow p-6 flex flex-col gap-2'>
            <h2 className='text-xl font-semibold'>Stats</h2>
            <p className='text-muted-foreground'>Coming soon: voting stats, repo submissions, and more.</p>
          </div>
        </div>
      </section>
    </ErrorBoundary>
  );
}
