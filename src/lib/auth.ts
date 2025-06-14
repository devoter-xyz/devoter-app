import { SiweMessage } from 'siwe';
import { prisma } from './db';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

export interface AuthSession {
  id: string;
  address: string;
  expiresAt: number;
}

export interface AuthUser {
  id: string;
  address: string;
}

// Cookie configuration
const SESSION_COOKIE_NAME = 'devoter-session';
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

export function createSession(user: AuthUser): AuthSession {
  return {
    id: user.id,
    address: user.address,
    expiresAt: Date.now() + SESSION_DURATION,
  };
}

export function isSessionValid(session: AuthSession): boolean {
  return session.expiresAt > Date.now();
}

export async function verifySiweSignature(message: string, signature: string, nonce: string): Promise<AuthUser | null> {
  try {
    const siwe = new SiweMessage(JSON.parse(message));
    
    const result = await siwe.verify({
      signature,
      domain: process.env.NEXT_PUBLIC_APP_URL || 'localhost:3000',
      nonce,
    });

    if (result.success) {
      const address = siwe.address.toLowerCase();
      
      // Find or create user
      let user = await prisma.user.findUnique({
        where: { walletAddress: address },
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            walletAddress: address,
          },
        });
      }

      return {
        id: user.id,
        address: user.walletAddress,
      };
    }
    
    return null;
  } catch (error) {
    console.error('SIWE verification error:', error);
    return null;
  }
}

export async function getSessionFromCookies(): Promise<AuthSession | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
    
    if (!sessionCookie?.value) {
      return null;
    }

    const session: AuthSession = JSON.parse(sessionCookie.value);
    
    if (!isSessionValid(session)) {
      return null;
    }

    return session;
  } catch (error) {
    console.error('Error reading session from cookies:', error);
    return null;
  }
}

export async function setSessionCookie(session: AuthSession): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION / 1000, // Convert to seconds
    path: '/',
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
} 