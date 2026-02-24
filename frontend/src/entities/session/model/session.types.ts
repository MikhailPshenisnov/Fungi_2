export interface SessionUser {
  id: string;
  name: string;
  email: string;
}

export interface SessionState {
  isAuthenticated: boolean;
  user: SessionUser | null;
}
