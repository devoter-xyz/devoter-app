
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, sepolia } from 'wagmi/chains';

export const createWagmiConfig = (projectId: string) => {
  const config = getDefaultConfig({
    appName: 'Devoter',
    projectId,
    chains: [mainnet, sepolia],
    ssr: true,
  });
  return config;
};
