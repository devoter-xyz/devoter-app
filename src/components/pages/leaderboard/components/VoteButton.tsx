'use client';

import { voteRepositoryAction } from '@/actions/repository/voteRepository/action';
import { Button } from '@/components/ui/button';
import { DEV_TOKEN_UNISWAP_URL } from '@/lib/constants';
import { InsufficientTokenBalanceError } from '@/lib/errors';
import { Vote } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { useRouter } from 'next/navigation';
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
      if (error.thrownError instanceof InsufficientTokenBalanceError) {
        toast.error(
          <div className='flex flex-col gap-y-2'>
            <span>You do not have enough DEV tokens to vote.</span>
            <a
              href={DEV_TOKEN_UNISWAP_URL}
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-500 underline'
            >
              Buy DEV tokens
            </a>
          </div>
        );
      } else {
        toast.error(error.serverError || 'An unexpected error occurred.');
      }
    }
  });

  return (
    <Button className='cursor-pointer' disabled={hasVoted || isExecuting} onClick={() => execute({ repositoryId })}>
      <Vote className='h-4 w-4' />
      {hasVoted ? 'Voted' : 'Vote'}
    </Button>
  );
};
