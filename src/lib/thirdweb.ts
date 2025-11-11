import { createThirdwebClient, getContract } from "thirdweb";
import { DEV_TOKEN_ADDRESS } from "./constants";

export const client = createThirdwebClient({
  secretKey: process.env.THIRDWEB_SECRET_KEY || "",
});

export const devTokenContract = getContract({
  client,
  chain: 8453,
  address: DEV_TOKEN_ADDRESS,
});
