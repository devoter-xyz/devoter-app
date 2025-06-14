'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useSignMessage } from 'wagmi';
import { SiweMessage } from 'siwe';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useSession } from '@/components/providers/SessionProvider';

export function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { user, isLoading, signIn, signOut } = useSession();
  const { signMessageAsync } = useSignMessage();
  const { toast } = useToast();
  const [isSigning, setIsSigning] = useState(false);

  // Auto-sign in when wallet is connected
  useEffect(() => {
    if (isConnected && address && !user && !isLoading) {
      handleSignIn();
    }
  }, [isConnected, address, user, isLoading]);

  const handleSignIn = async () => {
    if (!address) return;

    try {
      setIsSigning(true);
      
      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: 'Sign in with Ethereum to access Devoter App.',
        uri: window.location.origin,
        version: '1',
        chainId: 8453, // Base chain ID
        nonce: await fetch('/api/auth/nonce').then(res => res.json()).then(data => data.nonce),
      });

      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      });

      const success = await signIn(
        JSON.stringify(message),
        signature,
        message.nonce
      );

      if (success) {
        toast({
          title: 'Successfully connected',
          description: `Welcome! You're now signed in with ${address.slice(0, 6)}...${address.slice(-4)}`,
        });
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
        description: 'Failed to sign in with your wallet.',
        variant: 'destructive',
      });
    } finally {
      setIsSigning(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: 'Signed out',
      description: 'You have been successfully signed out.',
    });
  };

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
          {user.address.slice(0, 6)}...{user.address.slice(-4)}
        </span>
        <Button onClick={handleSignOut} variant="outline" size="sm">
          Sign Out
        </Button>
      </div>
    );
  }

  // Use the official RainbowKit ConnectButton
  return (
    <div className="flex items-center gap-2">
      <ConnectButton />
      {isSigning && (
        <span className="text-sm text-gray-500">Signing...</span>
      )}
    </div>
  );
} 