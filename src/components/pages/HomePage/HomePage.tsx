'use client';
import RepoCard from '@/components/common/RepoCard';
import RepoCardSkeleton from '@/components/common/RepoCardSkeleton';
import { getWeeklyTopRepos } from '@/actions/repository/getTopUniqueVotedRepositories/action';
import { ChartLine, Star } from 'lucide-react';
import { Suspense, useEffect, useState } from 'react';

type Repository = {
  id: string;
  owner: string;
  name: string;
  description: string;
  tags: string[];
  votes: number;
  appLogo: string;
};

const featuredRepo = [
  {
    id: '4',
    owner: 'microsoft',
    name: 'vscode',
    description: 'Visual Studio Code – Code editing. Redefined.',
    tags: ['Editor', 'TypeScript', 'Developer Tools'],
    votes: 61,
    appLogo: '/logo.svg'
  },
  {
    id: '5',
    owner: 'torvalds',
    name: 'linux',
    description: 'Linux kernel source tree.',
    tags: ['Kernel', 'Operating System', 'C'],
    votes: 78,
    appLogo: '/logo.svg'
  },
  {
    id: '6',
    owner: 'tensorflow',
    name: 'tensorflow',
    description: 'An open-source machine learning framework for everyone.',
    tags: ['Machine Learning', 'Deep Learning', 'Python'],
    votes: 55,
    appLogo: '/logo.svg'
  }
];

export default function HomePage() {
  const [topRepositories, setTopRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        const topRepos = await getWeeklyTopRepos();
        // Ensure each repo has an appLogo property
        // eslint-disable-next-line
        const reposWithLogo = topRepos.map((repo: any) => ({
          ...repo,
          appLogo: repo.appLogo || '/logo.svg'
        }));
        setTopRepositories(reposWithLogo);
      } catch (error) {
        console.error('Failed to fetch repositories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRepositories();
  }, []);

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
            {featuredRepo.map((repo) => (
              <RepoCard
                key={repo.id}
                id={repo.id}
                owner={repo.owner}
                name={repo.name}
                description={repo.description || ''}
                tags={repo.tags}
                votes={repo.votes}
                cardType='featured'
                appLogo={repo.appLogo}
              />
            ))}
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
            {loading ? (
              <>
                <RepoCardSkeleton />
                <RepoCardSkeleton />
                <RepoCardSkeleton />
              </>
            ) : (
              topRepositories.map((repo, index) => (
                <RepoCard
                  key={repo.id}
                  id={repo.id}
                  owner={repo.owner}
                  name={repo.name}
                  description={repo.description || ''}
                  tags={repo.tags}
                  votes={repo.votes}
                  cardType='default'
                  variant={index < 3 ? (['first', 'second', 'third'] as const)[index] : 'default'}
                  appLogo={repo.appLogo}
                  isFavorited={index % 2 === 0}
                />
              ))
            )}
          </Suspense>
        </div>
      </div>
    </section>
  );
}
