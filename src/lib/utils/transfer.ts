import { createThirdwebClient, getContract, sendAndConfirmTransaction } from 'thirdweb';
import { privateKeyToAccount } from 'thirdweb/wallets';
import { transferFrom } from 'thirdweb/extensions/erc20';
import { base } from 'thirdweb/chains';
import { RECIPIENT_WALLET_ADDRESS } from '@/lib/constants';

export const transferTokens = async (fromAddress: string, amount: number) => {
  const client = createThirdwebClient({
    secretKey: process.env.THIRDWEB_SECRET_KEY as string
  });

  const account = privateKeyToAccount({
    client,
    privateKey: process.env.SERVER_WALLET_PRIVATE_KEY as string
  });

  const contract = getContract({
    client,
    address: process.env.DEV_TOKEN_CONTRACT_ADDRESS as `0x${string}`,
    chain: base
  });

  const tx = transferFrom({
    contract,
    from: fromAddress,
    to: RECIPIENT_WALLET_ADDRESS,
    amount
  });

  return await sendAndConfirmTransaction({
    transaction: tx,
    account
  });
};
