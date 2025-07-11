'use client';

import { voteRepositoryAction } from '@/actions/repository/voteRepository/action';
import { Button } from '@/components/ui/button';
import { Vote } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAction } from 'next-safe-action/hooks';
import { toast } from 'sonner';

interface VoteButtonProps {
  repositoryId: string;
  hasVoted: boolean;
}

export const VoteButton = ({ repositoryId, hasVoted }: VoteButtonProps) => {
  const router = useRouter();

  const { execute, isExecuting } = useAction(voteRepositoryAction, {
    onSuccess: () => {
      router.refresh();
      toast.success('Voted successfully!');
    },
    onError: ({ error }) => {
      toast.error(error.serverError || 'An unexpected error occurred.');
    }
  });

  return (
    <Button
      className="cursor-pointer"
      disabled={hasVoted || isExecuting}
      onClick={() => execute({ repositoryId })}
    >
      <Vote className="h-4 w-4" />
      {hasVoted ? 'Voted' : 'Vote'}
    </Button>
  );
}; 