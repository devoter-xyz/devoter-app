import { ThirdwebSDK } from '@thirdweb-dev/sdk';

const DEV_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_DEV_TOKEN_ADDRESS!;
const CHAIN = 'base';

export const sdk = new ThirdwebSDK(CHAIN, {
  secretKey: process.env.THIRDWEB_SECRET_KEY
});

export const devTokenContract = sdk.getContract(DEV_TOKEN_ADDRESS); 