import { createContext } from 'react';
import { SessionState, SessionUser, SignInPayload } from './session.types';

export interface SessionContextValue extends SessionState {
  signIn: (payload: SignInPayload) => void;
  updateUser: (patch: Partial<SessionUser>) => void;
  signOut: () => void;
}

export const SessionContext = createContext<SessionContextValue | null>(null);
