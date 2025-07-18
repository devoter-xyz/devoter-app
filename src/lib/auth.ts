import { SiweMessage } from 'siwe';

export async function verifySiweSignature(message: string, signature: string, nonce: string): Promise<string | null> {
  try {
    const siwe = new SiweMessage(JSON.parse(message));

    const domain = process.env.NEXT_PUBLIC_APP_URL || 'localhost:3000';
    const result = await siwe.verify({
      signature,
      domain: domain.includes('://') ? domain : `http://${domain}`,
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
