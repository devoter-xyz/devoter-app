'use client';

import {
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactNode, useState } from 'react';
import { WagmiProvider } from 'wagmi';

import { getConfig } from '@/lib/wagmi';
import '@rainbow-me/rainbowkit/styles.css';

interface WalletProviderProps {
  children: ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  const [queryClient] = useState(() => new QueryClient());
  const [config] = useState(() => getConfig({ projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '' }));

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
} 