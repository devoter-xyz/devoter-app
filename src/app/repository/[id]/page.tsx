'use client';

import { useParams } from 'next/navigation';
import RepoSummary from '@/components/common/RepoSummary';
import RepositoryLeaderboard from '@/components/pages/repository/RepositoryLeaderboard';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { ThumbsUp, ThumbsDown, MessageCircle } from 'lucide-react';
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
  ],
  discussions: [
    {
      id: 'disc-1',
      user: {
        name: 'clippyClip99',
        walletAddress: '0xABC...123',
        avatar: '#F59E0B' // Orange color
      },
      content: "How does flowstate handle failed tasks in a multi-step pipeline? I've been experimenting with defining multi-step workflows, and I'm curious how the engine handles a failure in one of the middle steps. Does it retry automatically? Can we customize fallback behavior?",
      createdAt: new Date('2025-08-13T10:42:00Z'),
      upvotes: 12,
      downvotes: 2,
      replies: [
        {
          id: 'reply-1',
          user: {
            name: 'Marques Read',
            walletAddress: '0xDEF...456',
            avatar: '#10B981' // Green color
          },
          content: "Great question! By default, the engine will retry failed tasks up to 3 times with exponential backoff. You can override this in the step config using the retry and on_failure keys.",
          createdAt: new Date('2025-08-13T11:15:00Z'),
          upvotes: 8,
          downvotes: 0
        }
      ]
    },
    {
      id: 'disc-2',
      user: {
        name: 'devMaster2024',
        walletAddress: '0x789...ABC',
        avatar: '#8B5CF6' // Purple color
      },
      content: "Just integrated Next.js 15 with the new app directory. The performance improvements are incredible! Has anyone tried the new caching strategies?",
      createdAt: new Date('2025-08-13T09:30:00Z'),
      upvotes: 25,
      downvotes: 1,
      replies: [
        {
          id: 'reply-2',
          user: {
            name: 'ReactNinja',
            walletAddress: '0x456...DEF',
            avatar: '#EF4444' // Red color
          },
          content: "Yes! The fetch cache is a game changer. We saw 40% faster page loads on our e-commerce site.",
          createdAt: new Date('2025-08-13T09:45:00Z'),
          upvotes: 15,
          downvotes: 0
        },
        {
          id: 'reply-3',
          user: {
            name: 'TypeScriptFan',
            walletAddress: '0x321...GHI',
            avatar: '#3B82F6' // Blue color
          },
          content: "Don't forget to update your TypeScript config for the new features!",
          createdAt: new Date('2025-08-13T10:20:00Z'),
          upvotes: 7,
          downvotes: 0
        }
      ]
    },
    {
      id: 'disc-3',
      user: {
        name: 'webDevGuru',
        walletAddress: '0xGHI...789',
        avatar: '#F97316' // Orange color
      },
      content: "Question about Server Components: When should I use 'use client' vs keeping components server-side? I'm struggling with the decision tree.",
      createdAt: new Date('2025-08-12T16:20:00Z'),
      upvotes: 18,
      downvotes: 0,
      replies: []
    }
  ]
};

export default function DemoRepositoryPage() {
  const params = useParams();
  const id = params.id as string;

  const [votes, setVotes] = useState<number>(0);
  const [isFavorited, setIsFavorited] = useState<boolean>(false);
  const [leaderboardPage, setLeaderboardPage] = useState(1);

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

  const handleLeaderboardPageChange = (newPage: number) => {
    setLeaderboardPage(newPage);
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
        className='w-full'
      />

      {/* Tab switch implementation */}
      <div className='mt-8 max-w-5xl mx-auto'>
        <Tabs defaultValue='leader-board' className='w-full'>
          <TabsList className='grid w-2xl grid-cols-4 bg-transparent h-auto p-0 gap-0'>
            <TabsTrigger
              value='leader-board'
              className='relative bg-transparent border-0 rounded-none px-4 py-3 text-gray-600 hover:text-gray-900 data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-0.5 data-[state=active]:after:bg-primary hover:cursor-pointer'
            >
              Leader Board
            </TabsTrigger>
            <TabsTrigger
              value='discussion'
              className='relative bg-transparent border-0 rounded-none px-4 py-3 text-gray-600 hover:text-gray-900 data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-0.5 data-[state=active]:after:bg-primary hover:cursor-pointer'
            >
              Discussion
            </TabsTrigger>
            <TabsTrigger
              value='socials'
              className='relative bg-transparent border-0 rounded-none px-4 py-3 text-gray-600 hover:text-gray-900 data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-0.5 data-[state=active]:after:bg-primary hover:cursor-pointer'
            >
              Socials
            </TabsTrigger>
            <TabsTrigger
              value='about'
              className='relative bg-transparent border-0 rounded-none px-4 py-3 text-gray-600 hover:text-gray-900 data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-0.5 data-[state=active]:after:bg-primary hover:cursor-pointer'
            >
              About Repository
            </TabsTrigger>
          </TabsList>

          <TabsContent value='leader-board' className='mt-0'>
            <RepositoryLeaderboard
              votes={repo.votes}
              totalCount={repo.votes.length}
              hasMore={false}
              currentPage={leaderboardPage}
              onPageChange={handleLeaderboardPageChange}
              isLoading={false}
            />
          </TabsContent>

          <TabsContent value='discussion' className='mt-0'>
            <div className='space-y-4'>
              {repo.discussions.map((discussion) => (
                <div key={discussion.id} className='bg-white border border-gray-200 rounded-lg p-6'>
                  {/* Main Discussion */}
                  <div className='flex gap-4'>
                    {/* User Avatar */}
                    <div 
                      className='flex items-center justify-center w-12 h-12 rounded-full text-white font-semibold'
                      style={{ backgroundColor: discussion.user.avatar }}
                    >
                      {discussion.user.name.charAt(0).toUpperCase()}
                    </div>
                    
                    {/* Discussion Content */}
                    <div className='flex-1'>
                      <div className='flex items-center gap-3 mb-2'>
                        <h4 className='font-semibold text-gray-900'>{discussion.user.name}</h4>
                        <span className='text-sm text-gray-500'>{discussion.user.walletAddress}</span>
                        <span className='text-sm text-gray-500'>
                          {formatDistanceToNow(discussion.createdAt, { addSuffix: true })}
                        </span>
                      </div>
                      
                      <p className='text-gray-800 mb-4 leading-relaxed'>
                        {discussion.content}
                      </p>
                      
                      {/* Voting and Reply Buttons */}
                      <div className='flex items-center gap-4'>
                        <Button 
                          variant='ghost' 
                          size='sm' 
                          className='flex items-center gap-2 text-green-600 hover:text-green-700 hover:bg-green-50'
                        >
                          <ThumbsUp className='w-4 h-4' />
                          <span>{discussion.upvotes}</span>
                        </Button>
                        <Button 
                          variant='ghost' 
                          size='sm' 
                          className='flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50'
                        >
                          <ThumbsDown className='w-4 h-4' />
                          <span>{discussion.downvotes}</span>
                        </Button>
                        <Button 
                          variant='ghost' 
                          size='sm' 
                          className='flex items-center gap-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50'
                        >
                          <MessageCircle className='w-4 h-4' />
                          <span>Reply</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Replies */}
                  {discussion.replies.length > 0 && (
                    <div className='mt-6 pl-16 space-y-4'>
                      {discussion.replies.map((reply) => (
                        <div key={reply.id} className='bg-gray-50 border border-gray-100 rounded-lg p-4'>
                          <div className='flex gap-3'>
                            {/* Reply Avatar */}
                            <div 
                              className='flex items-center justify-center w-8 h-8 rounded-full text-white font-semibold text-sm'
                              style={{ backgroundColor: reply.user.avatar }}
                            >
                              {reply.user.name.charAt(0).toUpperCase()}
                            </div>
                            
                            {/* Reply Content */}
                            <div className='flex-1'>
                              <div className='flex items-center gap-3 mb-2'>
                                <h5 className='font-medium text-gray-900 text-sm'>{reply.user.name}</h5>
                                <span className='text-xs text-gray-500'>
                                  {formatDistanceToNow(reply.createdAt, { addSuffix: true })}
                                </span>
                              </div>
                              
                              <p className='text-gray-800 mb-3 text-sm leading-relaxed'>
                                {reply.content}
                              </p>
                              
                              {/* Reply Voting */}
                              <div className='flex items-center gap-3'>
                                <Button 
                                  variant='ghost' 
                                  size='sm' 
                                  className='flex items-center gap-1 text-green-600 hover:text-green-700 hover:bg-green-50 p-1 h-auto text-xs'
                                >
                                  <ThumbsUp className='w-3 h-3' />
                                  <span>{reply.upvotes}</span>
                                </Button>
                                <Button 
                                  variant='ghost' 
                                  size='sm' 
                                  className='flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50 p-1 h-auto text-xs'
                                >
                                  <ThumbsDown className='w-3 h-3' />
                                  <span>{reply.downvotes}</span>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value='socials' className='mt-0'>
            <div className='border rounded-md p-4 shadow-xs'>Socials Content</div>
          </TabsContent>

          <TabsContent value='about' className='mt-0'>
            <div className='border rounded-md p-4 shadow-xs'>
              <div className='space-y-6'>
                <div>
                  <h3 className='text-lg font-semibold mb-2'>Project Overview</h3>
                  <p className='text-gray-700'>
                    This repository contains a decentralized voting application built on blockchain technology. 
                    It allows users to submit their projects for community voting, with the most popular projects 
                    receiving recognition and potential funding opportunities. The platform aims to democratize 
                    project discovery and support in the open-source ecosystem.
                  </p>
                </div>
                
                <div>
                  <h3 className='text-lg font-semibold mb-2'>Key Features</h3>
                  <ul className='list-disc pl-5 space-y-1 text-gray-700'>
                    <li>Secure blockchain-based voting system</li>
                    <li>Weekly leaderboard of top-voted repositories</li>
                    <li>User authentication via wallet connection</li>
                    <li>Detailed repository analytics and insights</li>
                    <li>Community discussion and feedback mechanisms</li>
                    <li>Token-based incentives for participation</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className='text-lg font-semibold mb-2'>Technology Stack</h3>
                  <div className='flex flex-wrap gap-2'>
                    <span className='bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded'>Next.js</span>
                    <span className='bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded'>TypeScript</span>
                    <span className='bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded'>Prisma</span>
                    <span className='bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded'>Ethereum</span>
                    <span className='bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded'>Tailwind CSS</span>
                    <span className='bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded'>PostgreSQL</span>
                  </div>
                </div>
                
                <div>
                  <h3 className='text-lg font-semibold mb-2'>Team</h3>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='flex items-start gap-3'>
                      <div className='w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500'>JD</div>
                      <div>
                        <p className='font-medium'>Jane Doe</p>
                        <p className='text-sm text-gray-500'>Lead Developer</p>
                      </div>
                    </div>
                    <div className='flex items-start gap-3'>
                      <div className='w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500'>JS</div>
                      <div>
                        <p className='font-medium'>John Smith</p>
                        <p className='text-sm text-gray-500'>Blockchain Architect</p>
                      </div>
                    </div>
                    <div className='flex items-start gap-3'>
                      <div className='w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500'>AK</div>
                      <div>
                        <p className='font-medium'>Alice Kim</p>
                        <p className='text-sm text-gray-500'>UI/UX Designer</p>
                      </div>
                    </div>
                    <div className='flex items-start gap-3'>
                      <div className='w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500'>RJ</div>
                      <div>
                        <p className='font-medium'>Robert Johnson</p>
                        <p className='text-sm text-gray-500'>Product Manager</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className='text-lg font-semibold mb-2'>License</h3>
                  <p className='text-gray-700'>
                    This project is licensed under the MIT License - see the LICENSE file in the repository for details.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
