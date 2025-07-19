'use client';

import { getNonceAction } from '@/actions/auth/nonce/action';
import { signInAction } from '@/actions/auth/signin/action';
import { signOutAction } from '@/actions/auth/signout/action';
import { useSession } from '@/components/providers/SessionProvider';
import { Button } from '@/components/ui/button';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAction } from 'next-safe-action/hooks';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { SiweMessage } from 'siwe';
import { toast } from 'sonner';
import { getAddress } from 'viem';
import { useAccount, useSignMessage } from 'wagmi';

export function ConnectWallet() {
  const { executeAsync: signIn } = useAction(signInAction);
  const { executeAsync: signOut } = useAction(signOutAction);
  const { address, chainId, isConnected } = useAccount();
  const { user, isLoading } = useSession();
  const { signMessageAsync } = useSignMessage();
  const [isConnecting, setIsConnecting] = useState(false);
  const { openConnectModal } = useConnectModal();
  const router = useRouter();

  const handleSignIn = useCallback(
    async (_address: string) => {
      if (!_address) return;

      const { data: nonce } = await getNonceAction();

      if (!nonce) {
        toast.error('Failed to get nonce.');
        return;
      }

      try {
        // Create the SIWE message
        const messageObject = {
          domain: window.location.origin,
          address: getAddress(_address),
          uri: window.location.origin,
          version: '1',
          chainId: chainId ?? 1,
          nonce: nonce,
          issuedAt: new Date().toISOString(),
          statement: 'Sign in with Ethereum to access Devoter App.'
        };

        // Create and prepare the message for signing
        const message = new SiweMessage(messageObject);
        const preparedMessage = message.prepareMessage();

        // Get the signature
        const signature = await signMessageAsync({
          message: preparedMessage
        });

        // Send the original message object for verification
        const success = await signIn({
          message: JSON.stringify(messageObject),
          signature,
          nonce
        });

        if (success.data) {
          toast.success(`Welcome! You're now signed in with ${_address.slice(0, 6)}...${_address.slice(-4)}`);

          router.push('/');
        } else {
          toast.error('Failed to sign in with your wallet.');
        }
      } catch (error) {
        console.error('Sign in error:', error);
        toast.error(error instanceof Error ? error.message : 'Failed to sign in with your wallet.');
      } finally {
        setIsConnecting(false);
      }
    },
    [chainId, signMessageAsync, signIn, router, toast]
  );

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('You have been successfully signed out.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to sign out.');
    }
  };

  const handleClick = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      e.preventDefault();

      if (!openConnectModal) {
        toast.error('Please wait a moment and try again.');
        return;
      }

      setIsConnecting(true);

      try {
        if (!address || !isConnected) {
          openConnectModal();
        } else {
          await handleSignIn(address);
        }
      } catch (error) {
        console.error('Connection error:', error);
        toast.error(error instanceof Error ? error.message : 'Failed to connect wallet.');
        setIsConnecting(false);
      }
    },
    [address, isConnected, openConnectModal, handleSignIn]
  );

  // Handle successful wallet connection
  useEffect(() => {
    if (address && isConnected && isConnecting && !user) {
      handleSignIn(address);
    }
  }, [address, isConnected, isConnecting, user, handleSignIn]);

  if (isLoading) {
    return <Button disabled>Loading...</Button>;
  }

  if (user) {
    return (
      <div className='flex items-center gap-2'>
        <span className='text-sm text-gray-600'>
          {user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}
        </span>
        <Button onClick={handleSignOut} variant='outline' size='sm'>
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <div className='flex items-center gap-2'>
      <Button onClick={handleClick} disabled={isConnecting} className='min-w-[200px] cursor-pointer'>
        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
      </Button>
      {isConnecting && <span className='text-sm text-gray-500'>Signing...</span>}
    </div>
  );
}
