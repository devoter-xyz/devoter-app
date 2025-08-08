'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { Coins, User, Clock, Trophy, ChevronLeft, ChevronRight } from 'lucide-react';

export interface RepositoryVote {
  id: string;
  tokenAmount: string; // Changed from Decimal to string for better compatibility
  createdAt: Date;
  user: {
    walletAddress: string;
  };
}

export interface RepositoryLeaderboardProps {
  votes: RepositoryVote[];
  totalCount: number;
  hasMore: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

const RepositoryLeaderboard: React.FC<RepositoryLeaderboardProps> = ({
  votes,
  totalCount,
  hasMore,
  currentPage,
  onPageChange,
  isLoading = false
}) => {
  const formatTokenAmount = (amount: string) => {
    const num = parseFloat(amount);
    if (isNaN(num)) return '0.00';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toFixed(2);
  };

  const formatWalletAddress = (address: string) => {
    if (address.length <= 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (isLoading) {
    return (
      <Card className='p-6'>
        <div className='space-y-4'>
          {[...Array(5)].map((_, i) => (
            <div key={i} className='flex items-center space-x-4 p-4 border border-border rounded-lg animate-pulse'>
              <div className='w-12 h-12 bg-muted rounded-full'></div>
              <div className='flex-1 space-y-2'>
                <div className='h-4 bg-muted rounded w-1/4'></div>
                <div className='h-3 bg-muted rounded w-1/3'></div>
              </div>
              <div className='space-y-2'>
                <div className='h-4 bg-muted rounded w-16'></div>
                <div className='h-3 bg-muted rounded w-20'></div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (votes.length === 0) {
    return (
      <Card className='p-8 text-center'>
        <Trophy className='w-12 h-12 mx-auto mb-4 text-muted-foreground' />
        <h3 className='text-lg font-semibold text-foreground mb-2'>No votes yet</h3>
        <p className='text-muted-foreground'>Be the first to vote for this repository and claim the top spot!</p>
      </Card>
    );
  }

  return (
    <Card className='p-6'>
      {/* Header */}
      {/* <div className='flex items-center justify-between mb-6'>
        <div className='flex items-center gap-3'>
          <Trophy className='w-6 h-6 text-primary' />
          <h2 className='text-xl font-semibold text-foreground'>Repository Leaderboard</h2>
        </div>
        <Badge variant='outline' className='text-sm'>
          {totalCount} {totalCount === 1 ? 'vote' : 'votes'}
        </Badge>
      </div> */}

      {/* Votes List */}
      <div className='space-y-3'>
        {votes.map((vote) => {
          return (
            <div
              key={vote.id}
              className='grid grid-cols-3 gap-4 items-center p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors'
            >
              {/* Rank */}
              {/* <div className='flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full'>
                {rankIcon ? (
                  <span className='text-lg'>{rankIcon}</span>
                ) : (
                  <span className='text-sm font-semibold text-primary'>#{rank}</span>
                )}
              </div> */}

              {/* User Info */}
              <div className='flex flex-row items-center gap-3'>
                <div className='flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full'>
                  <User className='w-4 h-4 text-primary' />
                </div>
                <div className='flex flex-col'>
                  <div className='flex items-center gap-2 mb-1'>
                    <span className='font-medium text-foreground'>John Doe</span>
                  </div>
                  <div className='text-sm text-muted-foreground'>
                    <span>{formatWalletAddress(vote.user.walletAddress)}</span>
                  </div>
                </div>
              </div>

              {/* Time Info - Centered */}
              <div className='flex items-center justify-center'>
                <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                  <Clock className='w-3 h-3' />
                  <span>{formatDistanceToNow(new Date(vote.createdAt), { addSuffix: true })}</span>
                </div>
              </div>

              {/* Token Amount */}
              <div className='flex flex-col items-end'>
                <div className='flex items-center gap-1 text-lg font-semibold text-foreground mb-1'>
                  <Coins className='w-4 h-4 text-primary' />
                  <span>{formatTokenAmount(vote.tokenAmount)}</span>
                </div>
                <div className='text-xs text-muted-foreground'>DEV tokens</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalCount > 10 && (
        <div className='flex items-center justify-between mt-6 pt-4 border-t border-border'>
          <div className='text-sm text-muted-foreground'>
            Showing {(currentPage - 1) * 10 + 1} to {Math.min(currentPage * 10, totalCount)} of {totalCount} votes
          </div>
          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className='w-4 h-4' />
              Previous
            </Button>
            <Button variant='outline' size='sm' onClick={() => onPageChange(currentPage + 1)} disabled={!hasMore}>
              Next
              <ChevronRight className='w-4 h-4' />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default RepositoryLeaderboard;
