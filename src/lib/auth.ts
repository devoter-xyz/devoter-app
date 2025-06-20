import { SiweMessage } from 'siwe';

export async function verifySiweSignature(message: string, signature: string, nonce: string): Promise<string | null> {
  try {
    const siwe = new SiweMessage(JSON.parse(message));

    const result = await siwe.verify({
      signature,
      domain: process.env.NEXT_PUBLIC_APP_URL || 'localhost:3000',
      nonce
    });

    if (!result.success) {
      return null;
    }

    if (result.success) {
      const address = siwe.address.toLowerCase();
      return address;
    }

    return null;
  } catch (error) {
    console.error('SIWE verification error:', error);
    return null;
  }
}
