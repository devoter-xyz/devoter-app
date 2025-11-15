import { devTokenContract } from '@/lib/thirdweb';
import { readContract } from 'thirdweb';
import { formatUnits } from 'ethers/lib/utils';

export const getTokenBalance = async (walletAddress: string) => {
  const contract = devTokenContract;
  const balance = await readContract({
    contract,
    method: "function balanceOf(address account) view returns (uint256)",
    params: [walletAddress],
  });

  return formatUnits(balance, 18);
};