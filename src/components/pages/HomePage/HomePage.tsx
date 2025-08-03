import RepoCard from '@/components/common/RepoCard';
import RepoCardSkeleton from '@/components/common/RepoCardSkeleton';
import { ChartLine, Star } from 'lucide-react';
import { Suspense } from 'react';

const topRepo = [
  {
    id: '1',
    owner: 'openai',
    name: 'gpt-repo',
    description: 'A test repo for GPT functionality.',
    tags: ['AI', 'NLP', 'Machine Learning'],
    votes: 42,
    appLogo: '/logo.svg'
  },
  {
    id: '2',
    owner: 'vercel',
    name: 'next.js',
    description: 'The React Framework for the Web.',
    tags: ['React', 'Framework', 'SSR'],
    votes: 35,
    appLogo: '/logo.svg'
  },
  {
    id: '3',
    owner: 'facebook',
    name: 'react',
    description: 'A declarative, efficient, and flexible JavaScript library for building UI.',
    tags: ['JavaScript', 'Library', 'UI'],
    votes: 50,
    appLogo: '/logo.svg'
  }
];

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
            {topRepo.map((repo) => (
              <RepoCard
                key={repo.id}
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
            {featuredRepo.map((repo, index) => (
              <RepoCard
                key={repo.id}
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
            ))}
          </Suspense>
        </div>
      </div>
    </section>
  );
}
