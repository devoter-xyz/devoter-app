"use client"
import RepoCard from '@/components/common/RepoCard';
import { Heart } from 'lucide-react';

const favoriteRepos = [
  {
    id: 'fav-1',
    owner: 'openai',
    name: 'gpt-favorites',
    description: 'A favorite repo for GPT fans.',
    tags: ['AI', 'NLP', 'Machine Learning'],
    votes: 99,
    appLogo: '/logo.svg',
    isVerified: true
  },
  {
    id: 'fav-2',
    owner: 'vercel',
    name: 'next-fav',
    description: 'A favorite Next.js repo.',
    tags: ['React', 'Framework', 'SSR'],
    votes: 88,
    appLogo: '/logo.svg',
    isVerified: false
  },
  {
    id: 'fav-3',
    owner: 'facebook',
    name: 'react-fav',
    description: 'A favorite React repo.',
    tags: ['JavaScript', 'Library', 'UI'],
    votes: 77,
    appLogo: '/logo.svg',
    isVerified: true
  }
];

export default function FavoritesPage() {
  return (
    <section className='py-10 px-6 flex flex-col gap-10'>
      <div>
        <h1 className='mb-8 flex items-center gap-3 text-3xl font-bold'>
          <Heart className='h-7 w-7 text-pink-500' fill='pink' />
          Favorite Repositories
        </h1>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
          {favoriteRepos.map((repo) => (
            <RepoCard
              key={repo.id}
              id={repo.id}
              owner={repo.owner}
              name={repo.name}
              description={repo.description}
              tags={repo.tags}
              votes={repo.votes}
              cardType='featured'
              logoUrl={repo.appLogo}
              isVerified={repo.isVerified}
              variant='default'
            />
          ))}
        </div>
      </div>
    </section>
  );
}
