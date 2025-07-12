import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { DEV_TOKEN_ADDRESS } from './constants';

const CHAIN = 'base';

export const sdk = new ThirdwebSDK(CHAIN, {
  secretKey: process.env.THIRDWEB_SECRET_KEY
});

export const devTokenContract = sdk.getContract(DEV_TOKEN_ADDRESS);
