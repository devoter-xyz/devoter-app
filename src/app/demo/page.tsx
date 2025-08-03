'use client';

import RepoSummary from '@/components/common/RepoSummary';
import { useState } from 'react';

const mockRepositories = [
  {
    id: '1',
    name: 'Next.js',
    owner: 'vercel',
    description: 'The React Framework for the Web. Create full-stack applications with zero configuration, automatic code splitting, and built-in CSS support.',
    githubUrl: 'https://github.com/vercel/next.js',
    websiteUrl: 'https://nextjs.org',
    docsUrl: 'https://nextjs.org/docs',
    tags: ['React', 'TypeScript', 'Framework', 'SSR', 'Static Site Generation'],
    totalVotes: 2850,
    githubStars: 128000,
    githubForks: 26700,
    weeklyRank: 1,
    isFavorited: false,
    isVerified: true,
    logoUrl: '/dev-token-logo.png', // Using local image
  },
  {
    id: '2',
    name: 'React',
    owner: 'facebook',
    description: 'A declarative, efficient, and flexible JavaScript library for building user interfaces.',
    githubUrl: 'https://github.com/facebook/react',
    websiteUrl: 'https://reactjs.org',
    docsUrl: 'https://reactjs.org/docs',
    tags: ['JavaScript', 'Library', 'UI', 'Frontend', 'Virtual DOM'],
    totalVotes: 3920,
    githubStars: 230000,
    githubForks: 47000,
    weeklyRank: 2,
    isFavorited: true,
    isVerified: true,
    logoUrl: '/dev-token-logo.png', // Using local image
  },
  {
    id: '3',
    name: 'Tailwind CSS',
    owner: 'tailwindlabs',
    description: 'A utility-first CSS framework for rapidly building custom designs.',
    githubUrl: 'https://github.com/tailwindlabs/tailwindcss',
    websiteUrl: 'https://tailwindcss.com',
    docsUrl: 'https://tailwindcss.com/docs',
    tags: ['CSS', 'Framework', 'Utility-First', 'Design System'],
    totalVotes: 1890,
    githubStars: 84000,
    githubForks: 4200,
    weeklyRank: 5,
    isFavorited: false,
    isVerified: false,
    logoUrl: '/dev-token-logo.png', // Using local image
  },
];

export default function DemoPage() {
  const [favorites, setFavorites] = useState<string[]>(['2']);
  const [votes, setVotes] = useState<Record<string, number>>({
    '1': 2850,
    '2': 3920,
    '3': 1890,
  });

  const handleVote = (id: string) => {
    setVotes(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
    console.log(`Voted for repository ${id}`);
  };

  const handleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(fav => fav !== id)
        : [...prev, id]
    );
    console.log(`Toggled favorite for repository ${id}`);
  };

  return (
    <div className="py-8 space-y-12">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Repository Summary Component Demo</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          This page showcases the Repository Summary component with different states and configurations.
        </p>
      </div>

      {mockRepositories.map((repo) => (
        <div key={repo.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="mb-4">
            <h2 className="text-2xl font-semibold mb-2">
              {repo.name} - Rank #{repo.weeklyRank}
            </h2>
            <p className="text-gray-600">
              {repo.isVerified ? 'Verified' : 'Unverified'} • 
              {favorites.includes(repo.id) ? ' Favorited' : ' Not Favorited'}
            </p>
          </div>
          
          <RepoSummary
            {...repo}
            totalVotes={votes[repo.id] || repo.totalVotes}
            isFavorited={favorites.includes(repo.id)}
            onVote={() => handleVote(repo.id)}
            onFavorite={() => handleFavorite(repo.id)}
            className="max-w-none"
          />
        </div>
      ))}

      <div className="mt-16 p-6 bg-blue-50 rounded-lg border border-blue-200">
        <h2 className="text-2xl font-bold mb-4">Component Features</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Visual Elements</h3>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• Repository icon/logo</li>
              <li>• Repository name and owner</li>
              <li>• Description</li>
              <li>• Verification badge</li>
              <li>• Tags/categories</li>
              <li>• External links (GitHub, website, docs)</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Interactive Elements</h3>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• Vote button with DEV token</li>
              <li>• Favorite/heart button</li>
              <li>• Clickable external links</li>
              <li>• Responsive design</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Statistics Cards</h3>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• Total votes with DEV token icon</li>
              <li>• GitHub stars count</li>
              <li>• GitHub forks count</li>
              <li>• Weekly ranking position</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Responsive Features</h3>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• Mobile-friendly layout</li>
              <li>• Grid system for stats</li>
              <li>• Flexible content areas</li>
              <li>• Accessible color schemes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
