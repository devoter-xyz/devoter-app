'use client';

import { getTokenBalanceAction } from '@/actions/user/getTokenBalance/action';
import { voteRepositoryAction } from '@/actions/vote/voteRepository/action';
import { Button } from '@/components/ui/button';
import { DEV_TOKEN_ADDRESS, DEV_TOKEN_UNISWAP_URL } from '@/lib/constants';
import { InsufficientTokenBalanceError } from '@/lib/errors';
import { Vote } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { ConfirmationDialog } from '@/components/dialogs/ConfirmationDialog';
import { useWalletClient } from 'wagmi';
import { transferDevTokens } from '@/lib/utils/wallet-transfer';

interface VoteButtonProps {
  repositoryId: string;
  hasVoted: boolean;
}

export const VoteButton = ({ repositoryId, hasVoted }: VoteButtonProps) => {
  const router = useRouter();
  const { data: walletClient } = useWalletClient();

  const { execute: executeVote, isExecuting: isVoting } = useAction(voteRepositoryAction, {
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

  const {
    execute: fetchTokenBalance,
    result: tokenBalanceResult,
    isExecuting: isFetchingBalance
  } = useAction(getTokenBalanceAction);

  useEffect(() => {
    fetchTokenBalance();
  }, [fetchTokenBalance]);

  const tokenBalance = tokenBalanceResult?.data;
  const hasZeroBalance = tokenBalance !== undefined && parseFloat(tokenBalance) === 0;
  const voteFee = tokenBalance ? (parseFloat(tokenBalance) * 0.0025).toFixed(4) : '0';

  const handleVote = async () => {
    if (!walletClient) {
      toast.error('Please connect your wallet to vote.');
      return;
    }
    try {
      const txHash = await transferDevTokens(
        walletClient,
        DEV_TOKEN_ADDRESS,
        voteFee
      );
      executeVote({ repositoryId, txHash });
    } catch {
      toast.error('Transaction failed or was rejected.');
    }
  };

  return (
    <ConfirmationDialog
      trigger={
        <Button
          className='cursor-pointer'
          disabled={hasVoted || isVoting || hasZeroBalance || isFetchingBalance}
        >
          <Vote className='h-4 w-4' />
          {hasVoted ? 'Voted' : 'Vote'}
        </Button>
      }
      title='Are you sure you want to vote?'
      description={`You will be charged ${voteFee} DEV tokens for this vote.`}
      onConfirm={handleVote}
    />
  );
};
