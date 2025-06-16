'use client';

import { getNonceAction } from '@/actions/auth/nonce/action';
import { signInAction } from '@/actions/auth/signin/action';
import { signOutAction } from '@/actions/auth/signout/action';
import { useSession } from '@/components/providers/SessionProvider';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAction } from 'next-safe-action/hooks';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { SiweMessage } from 'siwe';
import { getAddress } from 'viem';
import { useAccount, useSignMessage } from 'wagmi';

export function ConnectWallet() {
  const { executeAsync: signIn } = useAction(signInAction);
  const { executeAsync: signOut } = useAction(signOutAction);
  const { address, chainId, isConnected } = useAccount();
  const { user, isLoading } = useSession();
  const { signMessageAsync } = useSignMessage();
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);
  const { openConnectModal } = useConnectModal();
  const router = useRouter();

  const handleSignIn = useCallback(async (_address: string) => {
    if (!_address) return;

    const { data: nonce } = await getNonceAction();

    if (!nonce) {
      toast({
        title: 'Authentication failed',
        description: 'Failed to get nonce.',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Create the SIWE message
      const messageObject = {
        domain: window.location.host,
        address: getAddress(_address),
        uri: window.location.origin,
        version: '1',
        chainId: chainId ?? 1,
        nonce: nonce,
        issuedAt: new Date().toISOString(),
        statement: 'Sign in with Ethereum to access Devoter App.',
      };

      // Create and prepare the message for signing
      const message = new SiweMessage(messageObject);
      const preparedMessage = message.prepareMessage();

      // Get the signature
      const signature = await signMessageAsync({
        message: preparedMessage,
      });

      // Send the original message object for verification
      const success = await signIn({
        message: JSON.stringify(messageObject),
        signature,
        nonce,
      });

      if (success.data) {
        toast({
          title: 'Successfully connected',
          description: `Welcome! You're now signed in with ${_address.slice(0, 6)}...${_address.slice(-4)}`,
        });

        router.push('/');
      } else {
        toast({
          title: 'Authentication failed',
          description: 'Failed to sign in with your wallet.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Sign in error:', error);
      toast({
        title: 'Authentication failed',
        description: error instanceof Error ? error.message : 'Failed to sign in with your wallet.',
        variant: 'destructive',
      });
    } finally {
      setIsConnecting(false);
    }
  }, [chainId, signMessageAsync, signIn, router, toast]);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: 'Signed out',
        description: 'You have been successfully signed out.',
      });
    } catch (error) {
      toast({
        title: 'Sign out failed',
        description: error instanceof Error ? error.message : 'Failed to sign out.',
        variant: 'destructive',
      });
    }
  };

  const handleClick = useCallback(async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();

    if (!openConnectModal) {
      toast({
        title: 'Connection unavailable',
        description: 'Please wait a moment and try again.',
        variant: 'destructive',
      });
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
      toast({
        title: 'Connection failed',
        description: error instanceof Error ? error.message : 'Failed to connect wallet.',
        variant: 'destructive',
      });
      setIsConnecting(false);
    }
  }, [address, isConnected, openConnectModal, handleSignIn, toast]);

  // Handle successful wallet connection
  useEffect(() => {
    if (address && isConnected && isConnecting && !user) {
      handleSignIn(address);
    }
  }, [address, isConnected, isConnecting, user, handleSignIn]);

  if (isLoading) {
    return (
      <Button disabled>
        Loading...
      </Button>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">
          {user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}
        </span>
        <Button onClick={handleSignOut} variant="outline" size="sm">
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button 
        onClick={handleClick}
        disabled={isConnecting}
        className="min-w-[200px] cursor-pointer"
      >
        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
      </Button>
      {isConnecting && (
        <span className="text-sm text-gray-500">Signing...</span>
      )}
    </div>
  );
} 