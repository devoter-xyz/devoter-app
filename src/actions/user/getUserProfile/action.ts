import { getUserProfileLogic } from "./logic";

export async function getUserProfile(walletAddress: string) {
  return getUserProfileLogic(walletAddress);
}
