import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
}

export const LeaderboardCard: React.FC<LeaderboardCardProps> = ({ repository, rank }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {rank}. {repository.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>{repository.description}</p>
        <p>Author: {repository.author}</p>
        <p>Votes: {repository.votes}</p>
        <a href={repository.url} target="_blank" rel="noopener noreferrer">
          View on GitHub
        </a>
      </CardContent>
    </Card>
  );
}; 