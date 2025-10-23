'use client';

import { getUserFromSessionAction } from '@/actions/auth/session/action';
import { GetUserFromSessionResult } from '@/actions/auth/session/logic';
import { useAction } from 'next-safe-action/hooks';
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';

interface SessionContextType {
  user: GetUserFromSessionResult | null;
  isLoading: boolean;
  refetchSession: () => void;
  clearSession: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

interface SessionProviderProps {
  children: ReactNode;
}

export function SessionProvider({ children }: SessionProviderProps) {
  const [user, setUser] = useState<GetUserFromSessionResult | null>(null);
  const { executeAsync: getUserFromSession, isExecuting } = useAction(getUserFromSessionAction);

  const fetchUser = useCallback(() => {
    getUserFromSession().then((result) => {
      setUser(result?.data ?? null);
    });
  }, [getUserFromSession]);

  useEffect(() => {
    fetchUser();
  }, [getUserFromSession, fetchUser]);

  const refetchSession = useCallback(() => {
    fetchUser();
  }, [fetchUser]);

  const clearSession = useCallback(() => {
    setUser(null);
  }, []);
  const value: SessionContextType = useMemo(() => ({
    user,
    isLoading: isExecuting,
    refetchSession,
    clearSession,
  }), [user, isExecuting, refetchSession, clearSession]);

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