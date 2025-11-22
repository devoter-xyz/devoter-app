'use client';
import ErrorBoundary from '@/components/ErrorBoundary';
import ErrorFallback from '@/components/common/ErrorFallback';
import RepoCard from '@/components/common/RepoCard';
import RepoCardSkeleton from '@/components/common/RepoCardSkeleton';
import { ChartLine, Star } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';
import { getTopReposThisWeekAction } from '@/actions/repository/getTopReposThisWeek';
import { useRouter, useSearchParams } from 'next/navigation';
import { Filter } from '@/components/common/Filter';
import { filterRepositories } from '@/actions/repository/filterRepositories/action';

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
  const router = useRouter();
  const searchParams = useSearchParams();
  const [repos, setRepos] = useState<RepoCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialFilters, setInitialFilters] = useState({
    selectedTags: [] as string[],
    org: '',
    maintainer: '',
    onlyFeatured: false,
    startDate: '',
    endDate: '',
    minVotes: 0,
    maxVotes: 0,
  });
  useEffect(() => {
    const tags = searchParams.get('tags');
    const org = searchParams.get('org');
    const maintainer = searchParams.get('maintainer');
    const onlyFeatured = searchParams.get('onlyFeatured') === 'true';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const minVotes = searchParams.get('minVotes');
    const maxVotes = searchParams.get('maxVotes');

    setInitialFilters({
      selectedTags: tags ? tags.split(',') : [],
      org: org || '',
      maintainer: maintainer || '',
      onlyFeatured,
      startDate: startDate || '',
      endDate: endDate || '',
      minVotes: minVotes ? Number(minVotes) : 0,
      maxVotes: maxVotes ? Number(maxVotes) : 0,
    });
  }, [searchParams]);

  const fetchRepositories = useCallback(async (filters: typeof initialFilters) => {
    setLoading(true);
    try {
      const result = await filterRepositories({
        tags: filters.selectedTags.length > 0 ? filters.selectedTags : undefined,
        org: filters.org || undefined,
        maintainer: filters.maintainer || undefined,
        // onlyFeatured: filters.onlyFeatured || undefined, // Not yet implemented in backend
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        minVotes: filters.minVotes || undefined,
        maxVotes: filters.maxVotes || undefined,
      });
      setRepos(result || []);
    } catch (e) {
      console.error("Failed to fetch repositories:", e);
      setRepos([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchRepositories(initialFilters);
  }, [initialFilters, fetchRepositories]);

  const handleApplyFilters = useCallback((filters: typeof initialFilters) => {
    const newSearchParams = new URLSearchParams();
    if (filters.selectedTags.length > 0) {
      newSearchParams.set('tags', filters.selectedTags.join(','));
    }
    if (filters.org) {
      newSearchParams.set('org', filters.org);
    }
    if (filters.maintainer) {
      newSearchParams.set('maintainer', filters.maintainer);
    }
    if (filters.onlyFeatured) {
      newSearchParams.set('onlyFeatured', 'true');
    }
    if (filters.startDate) {
      newSearchParams.set('startDate', filters.startDate);
    }
    if (filters.endDate) {
      newSearchParams.set('endDate', filters.endDate);
    }
    if (filters.minVotes) {
      newSearchParams.set('minVotes', filters.minVotes.toString());
    }
    if (filters.maxVotes) {
      newSearchParams.set('maxVotes', filters.maxVotes.toString());
    }
    router.push(`?${newSearchParams.toString()}`);
  }, [router]);

  // Split repos for featured and top (first 3 as featured, next 3 as top)
  const featuredRepos = repos.slice(0, 3);
  const topRepos = repos.slice(3, 6);

  return (
    <ErrorBoundary fallback={<ErrorFallback error={new Error("Failed to load repositories.")} />}>
      <section className='py-10 px-6 flex flex-col gap-10 lg:flex-row'>
        <div className="lg:w-1/4">
          <Filter onApply={handleApplyFilters} initialFilters={initialFilters} />
        </div>
        <div className="lg:w-3/4">
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
                featuredRepos.map((repo, index) => (
                  <RepoCard
                    key={repo.id}
                    id={repo.id}
                    owner={repo.owner || ''}
                    name={repo.name || repo.title}
                    description={repo.description || ''}
                    tags={repo.tags}
                    votes={repo.totalVotes}
                    cardType='featured'
                    logoUrl={repo.logoUrl || '/logo.svg'}
                    isVerified={repo.isVerified || false}
                    variant='default'
                    rank={index + 1} // Assign rank based on index for featured repos
                  />
                ))
              )}
            </div>
          </div>
          <div className="mt-10">
            <h1 className='mb-8 flex items-center gap-3 text-3xl font-bold'>
              <ChartLine className='h-7 w-7 text-green-600' />
              All Repositories
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
                  logoUrl={repo.logoUrl || '/logo.svg'}
                  // TODO: Replace with real favorite status (e.g., repo.isFavorited or userFavoritesSet.has(repo.id))
                  isFavorited={false} // Placeholder, as real favorite status is not yet available in RepoCardData
                  isVerified={repo.isVerified || false}
                  rank={index + 1} // Assign rank based on index for all repositories
                />
              ))
            )}
            </div>
          </div>
        </div>
      </section>
    </ErrorBoundary>
  );
}
