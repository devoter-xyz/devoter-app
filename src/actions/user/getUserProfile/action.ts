import { User } from "@prisma/client";
import { getUserProfileLogic } from "./logic";

export async function getUserProfile(
  walletAddress: string,
): Promise<User | null> {
  try {
    const user = await getUserProfileLogic(walletAddress);
    return user;
  } catch (error) {
    console.error(
      `Error in getUserProfile for wallet address ${walletAddress}:`,
      error,
    );
    throw error;
  }
}
