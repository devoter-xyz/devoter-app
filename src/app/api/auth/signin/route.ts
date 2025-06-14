import { NextRequest, NextResponse } from 'next/server';
import { verifySiweSignature, createSession, setSessionCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { message, signature, nonce } = await request.json();

    if (!message || !signature || !nonce) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify SIWE signature
    const user = await verifySiweSignature(message, signature, nonce);

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Create session
    const session = createSession(user);
    
    // Set session cookie
    await setSessionCookie(session);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        address: user.address,
      },
    });
  } catch (error) {
    console.error('Sign in error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 