import { devTokenContract } from '@/lib/thirdweb';
import { readContract } from 'thirdweb/utilities';

export const getTokenBalance = async (walletAddress: string) => {
  const contract = devTokenContract;
  const balance = await readContract({
    contract,
    method: "function balanceOf(address account) view returns (uint256)",
    params: [walletAddress],
  });

  return balance.toString();
};