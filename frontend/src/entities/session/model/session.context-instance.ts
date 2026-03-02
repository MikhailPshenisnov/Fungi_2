import { createContext } from 'react';
import { SessionState, SessionUser } from './session.types';

export interface SessionContextValue extends SessionState {
  signIn: (user: SessionUser) => void;
  signOut: () => void;
}

export const SessionContext = createContext<SessionContextValue | null>(null);
