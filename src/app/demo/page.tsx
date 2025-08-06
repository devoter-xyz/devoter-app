'use client';

import RepoSummary from '@/components/common/RepoSummary';
import RepositoryLeaderboard from '@/components/pages/repository/RepositoryLeaderboard';
import { useState } from 'react';

const mockRepositories = [
  {
    id: '1',
    name: 'Next.js',
    owner: 'vercel',
    description:
      'The React Framework for the Web. Create full-stack applications with zero configuration, automatic code splitting, and built-in CSS support.',
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
    logoUrl: '/dev-token-logo.png' // Using local image
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
    logoUrl: '/dev-token-logo.png' // Using local image
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
    logoUrl: '/dev-token-logo.png' // Using local image
  }
];

// Mock votes data for leaderboard demo
const mockVotes = [
  {
    id: 'vote-1',
    tokenAmount: '1500.50',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    user: {
      walletAddress: '0x742D35CC6475C2c5d8B7F3B2F93e8F1c1D2B7F5A'
    }
  },
  {
    id: 'vote-2',
    tokenAmount: '2250.75',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    user: {
      walletAddress: '0x1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T'
    }
  },
  {
    id: 'vote-3',
    tokenAmount: '890.25',
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    user: {
      walletAddress: '0x9F8E7D6C5B4A39281F2E3D4C5B6A798817263F4E'
    }
  },
  {
    id: 'vote-4',
    tokenAmount: '3100.00',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    user: {
      walletAddress: '0x5A4B3C2D1E0F9A8B7C6D5E4F3A2B1C0D9E8F7A6B'
    }
  },
  {
    id: 'vote-5',
    tokenAmount: '750.80',
    createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000), // 18 hours ago
    user: {
      walletAddress: '0x7C8D9E0F1A2B3C4D5E6F7A8B9C0D1E2F3A4B5C6D'
    }
  },
  {
    id: 'vote-6',
    tokenAmount: '1200.33',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    user: {
      walletAddress: '0x3E4F5A6B7C8D9E0F1A2B3C4D5E6F7A8B9C0D1E2F'
    }
  },
  {
    id: 'vote-7',
    tokenAmount: '675.90',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    user: {
      walletAddress: '0x8B9C0D1E2F3A4B5C6D7E8F9A0B1C2D3E4F5A6B7C'
    }
  },
  {
    id: 'vote-8',
    tokenAmount: '2500.15',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    user: {
      walletAddress: '0x2F3A4B5C6D7E8F9A0B1C2D3E4F5A6B7C8D9E0F1A'
    }
  }
];

export default function DemoPage() {
  const [favorites, setFavorites] = useState<string[]>(['2']);
  const [votes, setVotes] = useState<Record<string, number>>({
    '1': 2850,
    '2': 3920,
    '3': 1890
  });
  const [leaderboardPage, setLeaderboardPage] = useState(1);
  const [isLeaderboardLoading, setIsLeaderboardLoading] = useState(false);

  const handleVote = (id: string) => {
    setVotes((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
    console.log(`Voted for repository ${id}`);
  };

  const handleFavorite = (id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]));
    console.log(`Toggled favorite for repository ${id}`);
  };

  const handleLeaderboardPageChange = (newPage: number) => {
    setIsLeaderboardLoading(true);
    // Simulate loading delay
    setTimeout(() => {
      setLeaderboardPage(newPage);
      setIsLeaderboardLoading(false);
    }, 500);
  };

  return (
    <div className='py-8 space-y-12'>
      <div className='text-center mb-8'>
        <h1 className='text-4xl font-bold mb-4'>Repository Components Demo</h1>
        <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
          This page showcases the Repository Summary and Leaderboard components with different states and
          configurations.
        </p>
      </div>

      {/* Repository Summary Components */}
      <section>
        <h2 className='text-3xl font-bold mb-6 text-center'>Repository Summary Components</h2>
        {mockRepositories.map((repo) => (
          <div key={repo.id} className='mb-12 bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
            <div className='mb-4'>
              <h3 className='text-2xl font-semibold mb-2'>
                {repo.name} - Rank #{repo.weeklyRank}
              </h3>
              <p className='text-gray-600'>
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
              className='max-w-none'
            />
          </div>
        ))}
      </section>

      {/* Repository Leaderboard Component */}
      <section>
        <h2 className='text-3xl font-bold mb-6 text-center'>Repository Leaderboard Component</h2>
        <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
          <div className='mb-4'>
            <h3 className='text-2xl font-semibold mb-2'>Next.js - Voters Leaderboard</h3>
            <p className='text-gray-600'>Shows voters ranked by vote amount and recency</p>
          </div>

          <RepositoryLeaderboard
            votes={mockVotes}
            totalCount={mockVotes.length}
            hasMore={false}
            currentPage={leaderboardPage}
            onPageChange={handleLeaderboardPageChange}
            isLoading={isLeaderboardLoading}
          />
        </div>

        {/* Empty State Demo */}
        <div className='mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
          <div className='mb-4'>
            <h3 className='text-2xl font-semibold mb-2'>Empty Leaderboard State</h3>
            <p className='text-gray-600'>Shows what the component looks like when no votes exist</p>
          </div>

          <RepositoryLeaderboard
            votes={[]}
            totalCount={0}
            hasMore={false}
            currentPage={1}
            onPageChange={() => {}}
            isLoading={false}
          />
        </div>

        {/* Loading State Demo */}
        <div className='mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
          <div className='mb-4'>
            <h3 className='text-2xl font-semibold mb-2'>Loading Leaderboard State</h3>
            <p className='text-gray-600'>Shows the skeleton loading state while fetching votes</p>
          </div>

          <RepositoryLeaderboard
            votes={[]}
            totalCount={0}
            hasMore={false}
            currentPage={1}
            onPageChange={() => {}}
            isLoading={true}
          />
        </div>
      </section>

      <div className='mt-16 p-6 bg-blue-50 rounded-lg border border-blue-200'>
        <h2 className='text-2xl font-bold mb-4'>Component Features</h2>
        <div className='grid md:grid-cols-2 gap-6'>
          <div>
            <h3 className='text-lg font-semibold mb-2'>Repository Summary</h3>
            <ul className='space-y-1 text-sm text-gray-600'>
              <li>• Repository icon/logo display</li>
              <li>• Repository name and owner</li>
              <li>• Description and verification badge</li>
              <li>• Interactive vote and favorite buttons</li>
              <li>• Statistics cards (votes, stars, forks, rank)</li>
              <li>• Tags and external links</li>
            </ul>
          </div>
          <div>
            <h3 className='text-lg font-semibold mb-2'>Repository Leaderboard</h3>
            <ul className='space-y-1 text-sm text-gray-600'>
              <li>• Voter rankings with medals (🥇🥈🥉)</li>
              <li>• Wallet address truncation</li>
              <li>• Token amount formatting</li>
              <li>• Relative time display</li>
              <li>• Pagination support</li>
              <li>• Loading and empty states</li>
            </ul>
          </div>
          <div>
            <h3 className='text-lg font-semibold mb-2'>Interactive Elements</h3>
            <ul className='space-y-1 text-sm text-gray-600'>
              <li>• Vote button with DEV token</li>
              <li>• Favorite/heart button toggle</li>
              <li>• Hover effects and transitions</li>
              <li>• Page navigation controls</li>
            </ul>
          </div>
          <div>
            <h3 className='text-lg font-semibold mb-2'>Responsive Features</h3>
            <ul className='space-y-1 text-sm text-gray-600'>
              <li>• Mobile-friendly layouts</li>
              <li>• Adaptive grid systems</li>
              <li>• Skeleton loading states</li>
              <li>• Accessible color schemes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
