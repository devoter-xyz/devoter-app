/**
 * @file This utility validates the format of an Ethereum transaction hash.
 */

/**
 * Validates if a given string is a valid Ethereum transaction hash format.
 * A valid transaction hash is a hexadecimal string of 64 characters, prefixed with "0x".
 *
 * @param hash The string to validate as an Ethereum transaction hash.
 * @returns True if the hash is valid, false otherwise.
 */
export function validateTransactionHash(hash: string): boolean {
  if (!hash) {
    return false;
  }
  // Ethereum transaction hashes are 66 characters long (0x + 64 hex characters)
  const transactionHashRegex = /^0x[0-9a-fA-F]{64}$/;
  return transactionHashRegex.test(hash);
}
