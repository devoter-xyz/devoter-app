import { devTokenContract } from '@/lib/thirdweb';

export const getTokenBalance = async (walletAddress: string) => {
  const contract = await devTokenContract;
  const balance = await contract.erc20.balanceOf(walletAddress);
  return balance.displayValue;
}; 