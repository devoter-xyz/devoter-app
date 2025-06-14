import { createConfig, http } from 'wagmi';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
} from 'wagmi/chains';
import {
  metaMaskWallet,
  walletConnectWallet,
  coinbaseWallet,
  rainbowWallet,
  trustWallet,
  braveWallet,
  ledgerWallet,
  phantomWallet,
  argentWallet,
  uniswapWallet,
  okxWallet,
  binanceWallet,
  bitgetWallet,
  coreWallet,
  tahoWallet,
  rabbyWallet,
  oneKeyWallet,
  zerionWallet,
  imTokenWallet,
  tokenPocketWallet,
} from '@rainbow-me/rainbowkit/wallets';

// Configure wallet connectors with grouping
const connectors = connectorsForWallets(
  [
    {
      groupName: 'Popular',
      wallets: [
        metaMaskWallet,
        walletConnectWallet,
        coinbaseWallet,
        rainbowWallet,
        trustWallet,
      ],
    },
    {
      groupName: 'DeFi & Trading',
      wallets: [
        uniswapWallet,
        argentWallet,
        zerionWallet,
        phantomWallet,
        okxWallet,
      ],
    },
    {
      groupName: 'Exchange Wallets',
      wallets: [
        binanceWallet,
        bitgetWallet,
        coreWallet,
      ],
    },
    {
      groupName: 'Hardware & Security',
      wallets: [
        ledgerWallet,
        oneKeyWallet,
        braveWallet,
      ],
    },
    {
      groupName: 'Mobile Wallets',
      wallets: [
        tahoWallet,
        rabbyWallet,
        imTokenWallet,
        tokenPocketWallet,
      ],
    },
  ],
  {
    appName: 'Devoter App',
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'your-project-id',
  }
);

const config = createConfig({
  connectors,
  chains: [mainnet, polygon, optimism, arbitrum, base],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [optimism.id]: http(),
    [arbitrum.id]: http(),
    [base.id]: http(),
  },
  ssr: true,
});

export { config }; 