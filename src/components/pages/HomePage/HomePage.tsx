import { Suspense } from 'react';
import { ChartLine, Star } from 'lucide-react';
import WeeklyRepoList from './WeeklyRepoList';
import RepoCardSkeleton from '@/components/common/RepoCardSkeleton';

export default function HomePage() {
  return (
    <section className='py-10 px-6 flex flex-col gap-10'>
      <div>
        <h1 className='mb-8 flex items-center gap-3 text-3xl font-bold'>
          <Star className='h-7 w-7 text-orange-400' fill='orange' />
          Featured Repositories
        </h1>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
          <Suspense
            fallback={
              <>
                <RepoCardSkeleton />
                <RepoCardSkeleton />
                <RepoCardSkeleton />
              </>
            }
          >
            <WeeklyRepoList />
          </Suspense>
        </div>
      </div>
      <div>
        <h1 className='mb-8 flex items-center gap-3 text-3xl font-bold'>
          <ChartLine className='h-7 w-7' />
          Top Repositories
        </h1>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
          <Suspense
            fallback={
              <>
                <RepoCardSkeleton />
                <RepoCardSkeleton />
                <RepoCardSkeleton />
              </>
            }
          >
            <WeeklyRepoList />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
