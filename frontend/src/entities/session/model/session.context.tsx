import { PropsWithChildren, useMemo, useState } from 'react';
import { SessionUser } from './session.types';
import { SessionContext, SessionContextValue } from './session.context-instance';

export interface SessionProviderProps extends PropsWithChildren {
  initialUser?: SessionUser | null;
}

export function SessionProvider({ children, initialUser = null }: SessionProviderProps) {
  const [user, setUser] = useState<SessionUser | null>(initialUser);

  const value = useMemo<SessionContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      signIn: setUser,
      signOut: () => setUser(null)
    }),
    [user]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}
