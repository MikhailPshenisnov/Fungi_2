export interface SessionUser {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  roleId: string;
  roleName: string;
  roleAccessLevel: number;
  permissions: string[];
}

export interface SessionState {
  isAuthenticated: boolean;
  user: SessionUser | null;
  token: string | null;
  isSessionLoading: boolean;
}

export interface SignInPayload {
  user: SessionUser;
  token: string;
  rememberSession?: boolean;
}
