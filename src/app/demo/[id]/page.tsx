'use client';

import { useParams } from 'next/navigation';
import RepoSummary from '@/components/common/RepoSummary';
import { useState } from 'react';

// Mock data for demo purposes
const mockRepository = {
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
  logoUrl: '/dev-token-logo.png',
  votes: [
    {
      id: '1a',
      tokenAmount: '150.50',
      createdAt: new Date('2025-08-05T10:30:00Z'),
      user: { walletAddress: '0x1234567890abcdef1234567890abcdef12345678' }
    },
    {
      id: '1b',
      tokenAmount: '89.25',
      createdAt: new Date('2025-08-04T15:45:00Z'),
      user: { walletAddress: '0xabcdef1234567890abcdef1234567890abcdef12' }
    },
    {
      id: '1c',
      tokenAmount: '200.00',
      createdAt: new Date('2025-08-04T08:20:00Z'),
      user: { walletAddress: '0x9876543210fedcba9876543210fedcba98765432' }
    },
    {
      id: '1d',
      tokenAmount: '75.75',
      createdAt: new Date('2025-08-03T14:10:00Z'),
      user: { walletAddress: '0xfedcba9876543210fedcba9876543210fedcba98' }
    },
    {
      id: '1e',
      tokenAmount: '125.00',
      createdAt: new Date('2025-08-03T09:55:00Z'),
      user: { walletAddress: '0x2468ace02468ace02468ace02468ace02468ace0' }
    }
  ]
};

export default function DemoRepositoryPage() {
  const params = useParams();
  const id = params.id as string;

  const [votes, setVotes] = useState<number>(0);
  const [isFavorited, setIsFavorited] = useState<boolean>(false);

  // Get repository data - now using the single mock repository with the ID from params
  const repo = {
    ...mockRepository,
    id: id // Use the ID from the URL params
  };

  const handleVote = () => {
    setVotes((prev) => prev + 1);
    console.log(`Voted for repository ${id}`);
  };

  const handleFavorite = () => {
    setIsFavorited((prev) => !prev);
    console.log(`Toggled favorite for repository ${id}`);
  };

  return (
    <div className=' mx-auto px-6 py-8'>
      {/* <div className="bg-white rounded-lg border border-gray-200 overflow-hidden"> */}

      <RepoSummary
        {...repo}
        totalVotes={(repo.totalVotes || 0) + votes}
        isFavorited={isFavorited}
        onVote={handleVote}
        onFavorite={handleFavorite}
      />
    </div>
  );
}
