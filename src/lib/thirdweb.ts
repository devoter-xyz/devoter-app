import { createThirdwebClient, getContract } from "thirdweb";
import { base } from "thirdweb/chains";
import { DEV_TOKEN_ADDRESS } from "./constants";

if (!process.env.THIRDWEB_SECRET_KEY) {
  throw new Error("Missing THIRDWEB_SECRET_KEY environment variable");
}

export const client = createThirdwebClient({
  secretKey: process.env.THIRDWEB_SECRET_KEY,
});

export const devTokenContract = getContract({
  client,
  chain: base,
  address: DEV_TOKEN_ADDRESS,
});
