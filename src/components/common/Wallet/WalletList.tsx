'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';

export function WalletList() {
  const walletGroups = [
    {
      name: 'Popular',
      wallets: ['MetaMask', 'WalletConnect', 'Coinbase Wallet', 'Rainbow', 'Trust Wallet'],
    },
    {
      name: 'DeFi & Trading',
      wallets: ['Uniswap Wallet', 'Argent', 'Zerion', 'Phantom', 'OKX Wallet'],
    },
    {
      name: 'Exchange Wallets',
      wallets: ['Binance Web3 Wallet', 'Bitget', 'Core'],
    },
    {
      name: 'Hardware & Security',
      wallets: ['Ledger Live', 'OneKey', 'Brave Wallet'],
    },
    {
      name: 'Mobile Wallets',
      wallets: ['Taho', 'Rabby Wallet', 'imToken', 'TokenPocket'],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <ConnectButton />
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Supported Wallets</h3>
        <div className="space-y-4">
          {walletGroups.map((group) => (
            <div key={group.name} className="border-b border-gray-200 pb-4 last:border-b-0">
              <h4 className="font-medium text-gray-900 mb-2">{group.name}</h4>
              <div className="flex flex-wrap gap-2">
                {group.wallets.map((wallet) => (
                  <span
                    key={wallet}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {wallet}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 