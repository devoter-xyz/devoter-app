'use client';

import { getUserFromSessionAction } from '@/actions/auth/session/action';
import { GetUserFromSessionResult } from '@/actions/auth/session/logic';
import { useAction } from 'next-safe-action/hooks';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface SessionContextType {
  user: GetUserFromSessionResult | null;
  isLoading: boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

interface SessionProviderProps {
  children: ReactNode;
}

export function SessionProvider({ children }: SessionProviderProps) {
  const [user, setUser] = useState<GetUserFromSessionResult | null>(null);
  const { executeAsync: getUserFromSession, isExecuting } = useAction(getUserFromSessionAction);

  useEffect(() => {
    getUserFromSession().then((result) => {
      if (result?.data) {
        setUser(result.data);
      }
    });
  }, [getUserFromSession]);


  const value: SessionContextType = {
    user,
    isLoading: isExecuting,
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