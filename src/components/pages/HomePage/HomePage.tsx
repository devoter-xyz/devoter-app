'use client';
import RepoCard from '@/components/common/RepoCard';
import RepoCardSkeleton from '@/components/common/RepoCardSkeleton';
import { ChartLine, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getTopReposThisWeekAction } from '@/actions/repository/getTopReposThisWeek';

type RepoCardData = {
  id: string;
  owner: string | null;
  name: string | null;
  title: string;
  description: string;
  tags: string[];
  totalVotes: number;
  logoUrl: string | null;
  isVerified?: boolean;
};

export default function HomePage() {
  const [repos, setRepos] = useState<RepoCardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const result = await getTopReposThisWeekAction({ limit: 6 });
        setRepos(result?.data?.repositories || []);
      } catch (e) {
        setRepos([]);
      }
      setLoading(false);
    })();
  }, []);

  // Split repos for featured and top (first 3 as featured, next 3 as top)
  const featuredRepos = repos.slice(0, 3);
  const topRepos = repos.slice(3, 6);

  return (
    <section className='py-10 px-6 flex flex-col gap-10'>
      <div>
        <h1 className='mb-8 flex items-center gap-3 text-3xl font-bold'>
          <Star className='h-7 w-7 text-orange-400' fill='orange' />
          Featured Repositories
        </h1>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
          {loading ? (
            <>
              <RepoCardSkeleton />
              <RepoCardSkeleton />
              <RepoCardSkeleton />
            </>
          ) : (
            featuredRepos.map((repo) => (
              <RepoCard
                key={repo.id}
                id={repo.id}
                owner={repo.owner || ''}
                name={repo.name || repo.title}
                description={repo.description || ''}
                tags={repo.tags}
                votes={repo.totalVotes}
                cardType='featured'
                appLogo={repo.logoUrl || '/logo.svg'}
                isVerified={repo.isVerified}
              />
            ))
          )}
        </div>
      </div>
      <div>
        <h1 className='mb-8 flex items-center gap-3 text-3xl font-bold'>
          <ChartLine className='h-7 w-7 text-green-600' />
          Top Repositories
        </h1>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
          {loading ? (
            <>
              <RepoCardSkeleton />
              <RepoCardSkeleton />
              <RepoCardSkeleton />
            </>
          ) : (
            topRepos.map((repo, index) => (
              <RepoCard
                key={repo.id}
                id={repo.id}
                owner={repo.owner || ''}
                name={repo.name || repo.title}
                description={repo.description || ''}
                tags={repo.tags}
                votes={repo.totalVotes}
                cardType='default'
                variant={index < 3 ? (['first', 'second', 'third'] as const)[index] : 'default'}
                appLogo={repo.logoUrl || '/logo.svg'}
                isFavorited={index % 2 === 0}
                isVerified={repo.isVerified}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
