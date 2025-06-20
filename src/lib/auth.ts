import { cookies } from 'next/headers';
import { SiweMessage } from 'siwe';

export async function verifySiweSignature(message: string, signature: string, nonce: string): Promise<string | null> {
  try {
    const siwe = new SiweMessage(JSON.parse(message));
    
    const result = await siwe.verify({
      signature,
      domain: process.env.NEXT_PUBLIC_APP_URL || 'localhost:3000',
      nonce,
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

export function getSession(): { walletAddress: string } | null {
  const cookieStore = cookies();
  const walletAddress = cookieStore.get('wallet_address')?.value;
  // const walletAddress = "slkadjflaksjdflkajsdlfkjsadlfkj" // just a dummy walletAddress for testing

  if (!walletAddress) {
    return null;
  }


  return { walletAddress };
}

export function setSession(walletAddress: string) {
  const cookieStore = cookies();
  cookieStore.set('wallet_address', walletAddress, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 1 week
  });
}

export function clearSession() {
  const cookieStore = cookies();
  cookieStore.delete('wallet_address');
}