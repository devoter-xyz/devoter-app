'use client';

import { connectorsForWallets } from '@rainbow-me/rainbowkit';

import {
  coinbaseWallet,
  injectedWallet,
  metaMaskWallet,
  rainbowWallet,
  safeWallet,
  walletConnectWallet,
  zerionWallet
} from '@rainbow-me/rainbowkit/wallets';
import type { Chain, Transport } from 'viem';
import { cookieStorage, createConfig, createStorage, fallback, http } from 'wagmi';
import {
  arbitrum,
  arbitrumSepolia,
  base,
  baseSepolia,
  celo,
  mainnet,
  optimism,
  optimismSepolia,
  sepolia,
  zora,
  zoraSepolia
} from 'wagmi/chains';

export function getConfig(options?: { projectId?: string }) {
  const projectId = options?.projectId || '';

  const wagmiChains = [
    mainnet,
    sepolia,
    base,
    baseSepolia,
    optimism,
    optimismSepolia,
    arbitrum,
    arbitrumSepolia,
    zora,
    zoraSepolia,
    celo
  ] as [Chain, ...Chain[]];

  const transports = wagmiChains.reduce<Record<string, Transport>>((acc, chain) => {
    try {
      acc[chain.id] = fallback([http()]);
      return acc;
    } catch (err) {
      console.error(err);
      acc[chain.id] = http();
      return acc;
    }
  }, {});

  const connectors = connectorsForWallets(
    [
      {
        groupName: 'Popular',
        wallets: [metaMaskWallet, rainbowWallet, safeWallet, coinbaseWallet, walletConnectWallet, zerionWallet, injectedWallet]
      },
      
    ],
    {
      appName: 'Devoter App',
      projectId,
      appDescription: 'Devoter App',
      appUrl: 'https://devoter.app',
      appIcon: 'https://devoter.xyz/images/icon.png',
      walletConnectParameters: {
        metadata: {
          name: 'Devoter App',
          description: 'Devoter App',
          url: 'https://devoter.xyz',
          icons: ['https://devoter.xyz/images/icon.png']
        }
      }
    }
  );
  const config = createConfig({
    connectors,
    chains: wagmiChains,
    transports,
    ssr: true,
    storage: createStorage({ storage: cookieStorage })
  });

  return config;
}
