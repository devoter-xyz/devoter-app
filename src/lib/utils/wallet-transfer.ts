import { ethers } from 'ethers';
import { RECIPIENT_WALLET_ADDRESS } from '@/lib/constants';
import { type WalletClient } from 'viem';
import { providers } from 'ethers';

const ERC20_ABI = ['function transfer(address to, uint256 amount) returns (bool)'];

export function walletClientToSigner(walletClient: WalletClient) {
  const { account, chain, transport } = walletClient;
  if (!account) throw new Error('Account not found');
  if (!chain) throw new Error('Chain not found');

  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address
  };
  const provider = new providers.Web3Provider(transport, network);
  const signer = provider.getSigner(account.address);
  return signer;
}

export const transferDevTokens = async (
  walletClient: WalletClient,
  tokenAddress: string,
  amount: string
) => {
  const signer = walletClientToSigner(walletClient);
  const contract = new ethers.Contract(tokenAddress, ERC20_ABI, signer);
  const tx = await contract.transfer(RECIPIENT_WALLET_ADDRESS, ethers.utils.parseUnits(amount, 18));
  await tx.wait();
  return tx.hash;
}; 