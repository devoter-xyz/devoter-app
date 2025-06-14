'use client';

import { useAccount } from 'wagmi';
import { useSession } from '@/components/providers/SessionProvider';

export function useAuth() {
  const { address, isConnected } = useAccount();
  const { user, isLoading } = useSession();

  const isAuthenticated = !!user && !!address;
  const walletAddress = address || user?.address;

  return {
    // Wallet state
    address,
    isConnected,
    
    // Session state
    user,
    isLoading,
    
    // Combined state
    isAuthenticated,
    walletAddress,
    
    // Helper functions
    getDisplayAddress: () => {
      if (!walletAddress) return '';
      return `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;
    },
  };
} 