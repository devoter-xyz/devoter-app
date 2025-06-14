'use client';

import {
  RainbowKitProvider as RainbowKitProviderBase,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { config } from '@/lib/wagmi';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
import { ReactNode } from 'react';

const queryClient = new QueryClient();

interface RainbowKitProviderProps {
  children: ReactNode;
}

export function RainbowKitProvider({ children }: RainbowKitProviderProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProviderBase>
          {children}
        </RainbowKitProviderBase>
      </QueryClientProvider>
    </WagmiProvider>
  );
} 