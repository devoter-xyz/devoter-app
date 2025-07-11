'use client';

import { voteRepositoryAction } from '@/actions/repository/voteRepository/action';
import { Button } from '@/components/ui/button';
import { Vote } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

interface VoteButtonProps {
  repositoryId: string;
  hasVoted: boolean;
}

export const VoteButton = ({ repositoryId, hasVoted }: VoteButtonProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleVote = async () => {
    startTransition(async () => {
      try {
        await voteRepositoryAction({ repositoryId });
        router.refresh();
      } catch (error) {
        // TODO: Handle error with a toast notification
        console.error(error);
      }
    });
  };

  return (
    <Button className="cursor-pointer" disabled={hasVoted || isPending} onClick={handleVote}>
      <Vote className="h-4 w-4" />
      {hasVoted ? 'Voted' : 'Vote'}
    </Button>
  );
}; 