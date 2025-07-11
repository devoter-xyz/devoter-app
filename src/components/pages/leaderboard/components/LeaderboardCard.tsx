import { Github, Medal, Trophy } from 'lucide-react';
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { VoteButton } from './VoteButton';

interface LeaderboardCardProps {
  repository: {
    id: string;
    name: string;
    description: string;
    author: string;
    url: string;
    votes: number;
  };
  rank: number;
  hasVoted: boolean;
}

export const LeaderboardCard: React.FC<LeaderboardCardProps> = ({
  repository,
  rank,
  hasVoted,
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
                'text-orange-400': rank === 3,
              })}
            />
          ) : (
            <div className="text-xl font-bold text-gray-500">{rank}</div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <CardTitle className="truncate text-lg font-semibold">{repository.name}</CardTitle>
          <CardDescription className="truncate text-sm text-gray-500">
            by {repository.author}
          </CardDescription>
        </div>
        <Badge variant="secondary" className="flex items-center gap-1">
          <Trophy className="h-4 w-4" />
          {repository.votes}
        </Badge>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-between">
        <p className="text-sm text-gray-600 line-clamp-3">{repository.description}</p>
        <div className="h-5"></div>
        <div className="flex items-center justify-between">
          <Link
            href={repository.url}
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