'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthSession, AuthUser } from '@/lib/auth';

interface SessionContextType {
  session: AuthSession | null;
  user: AuthUser | null;
  isLoading: boolean;
  signIn: (message: string, signature: string, nonce: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

interface SessionProviderProps {
  children: ReactNode;
}

export function SessionProvider({ children }: SessionProviderProps) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSession = async () => {
    try {
      const response = await fetch('/api/auth/session');
      if (response.ok) {
        const data = await response.json();
        const sessionData: AuthSession = {
          id: data.user.id,
          address: data.user.address,
          expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days
        };
        setSession(sessionData);
        setUser(data.user);
      } else {
        setSession(null);
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching session:', error);
      setSession(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (message: string, signature: string, nonce: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, signature, nonce }),
      });

      if (response.ok) {
        const data = await response.json();
        const sessionData: AuthSession = {
          id: data.user.id,
          address: data.user.address,
          expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days
        };
        setSession(sessionData);
        setUser(data.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Sign in error:', error);
      return false;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await fetch('/api/auth/signout', {
        method: 'POST',
      });
      setSession(null);
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const refreshSession = async (): Promise<void> => {
    await fetchSession();
  };

  useEffect(() => {
    fetchSession();
  }, []);

  const value: SessionContextType = {
    session,
    user,
    isLoading,
    signIn,
    signOut,
    refreshSession,
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
} 