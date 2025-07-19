import { Github, Medal, Users } from 'lucide-react';
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { VoteButton } from './VoteButton';
import { DevTokenLogo } from '@/components/common/DevTokenLogo';
import { LeaderboardEntry } from '@/actions/leaderboard/getLeaderboard/logic';

interface LeaderboardCardProps {
  repository: LeaderboardEntry['repository'];
  rank: number;
  hasVoted: boolean;
}

export const LeaderboardCard: React.FC<LeaderboardCardProps> = ({
  repository,
  rank,
  hasVoted
}) => {
  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-200 cursor-pointer">
      <CardHeader className="flex-row items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center">
          {rank <= 3 ? (
            <Medal
              className={cn('h-8 w-8', {
                'text-yellow-400': rank === 1,
                'text-gray-400': rank === 2,
                'text-orange-400': rank === 3
              })}
            />
          ) : (
            <div className="text-xl font-bold text-gray-500">{rank}</div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <CardTitle className="truncate text-lg font-semibold">{repository.title}</CardTitle>
          <CardDescription className="truncate text-sm text-gray-500">
            by {repository.submitter.walletAddress}
          </CardDescription>
        </div>
        <div className="flex flex-col gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {repository.uniqueVoteCount} Unique Votes
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <DevTokenLogo size={16} />
            {repository.totalVotingPower.toNumber().toFixed(2)} Total Votes
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-between">
        <p className="text-sm text-gray-600 line-clamp-3">{repository.description}</p>
        <div className="h-5"></div>
        <div className="flex items-center justify-between">
          <Link
            href={repository.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-blue-500 hover:underline"
          >
            <Github className="h-4 w-4" />
            <span>View on GitHub</span>
          </Link>
          <VoteButton repositoryId={repository.id} hasVoted={hasVoted} />
        </div>
      </CardContent>
    </Card>
  );
}; 