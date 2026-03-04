import { PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react';
import { requestJson } from '@shared/api';
import { normalizeAvatarUrl } from '@shared/lib/normalizeAvatarUrl';
import { SessionUser, SignInPayload } from './session.types';
import { SessionContext, SessionContextValue } from './session.context-instance';
import { normalizePermissionCodes, type RoleDtoApi } from './role.types';

const STORYBOOK_TOKEN = 'storybook-token';
const AUTH_TOKEN_STORAGE_KEY = 'fungi_auth_token';

interface CurrentUserProfileApiResult {
  user: {
    id: string;
    username: string;
    email: string;
    avatarUrl?: string | null;
    role?: RoleDtoApi | null;
  };
}

function mapApiUserToSessionUser(apiUser: CurrentUserProfileApiResult['user']): SessionUser {
  const accessLevel =
    typeof apiUser.role?.accessLevel === 'number' && Number.isFinite(apiUser.role.accessLevel)
      ? apiUser.role.accessLevel
      : 20;
  const roleName = typeof apiUser.role?.name === 'string' && apiUser.role.name.trim().length > 0
    ? apiUser.role.name.trim()
    : 'Unknown role';

  return {
    id: apiUser.id,
    name: apiUser.username,
    email: apiUser.email,
    avatarUrl: normalizeAvatarUrl(apiUser.avatarUrl),
    roleId: apiUser.role?.id ?? '',
    roleName,
    roleAccessLevel: accessLevel,
    permissions: normalizePermissionCodes(apiUser.role?.permissions)
  };
}

function readStoredToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const token = window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
    return token && token.length > 0 ? token : null;
  } catch {
    return null;
  }
}

function persistToken(token: string | null) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    if (token) {
      window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
      return;
    }

    window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  } catch {
    // intentionally ignore localStorage errors to avoid blocking auth flow
  }
}

export interface SessionProviderProps extends PropsWithChildren {
  initialUser?: SessionUser | null;
  initialToken?: string | null;
}

export function SessionProvider({
  children,
  initialUser = null,
  initialToken = null
}: SessionProviderProps) {
  const [user, setUser] = useState<SessionUser | null>(initialUser);
  const [token, setToken] = useState<string | null>(() => {
    if (initialToken) {
      return initialToken;
    }

    if (initialUser) {
      return STORYBOOK_TOKEN;
    }

    return readStoredToken();
  });
  const [isSessionLoading, setIsSessionLoading] = useState<boolean>(
    () => token !== null && token !== STORYBOOK_TOKEN && initialUser === null
  );

  useEffect(() => {
    if (user || !token || token === STORYBOOK_TOKEN) {
      setIsSessionLoading(false);
      return;
    }

    let isCancelled = false;
    setIsSessionLoading(true);

    void requestJson<CurrentUserProfileApiResult>('/Users/GetCurrentUserProfile', {
      method: 'GET',
      token
    })
      .then((result) => {
        if (isCancelled) {
          return;
        }

        setUser(mapApiUserToSessionUser(result.user));
      })
      .catch(() => {
        if (isCancelled) {
          return;
        }

        setUser(null);
        setToken(null);
        persistToken(null);
      })
      .finally(() => {
        if (isCancelled) {
          return;
        }

        setIsSessionLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [token, user]);

  const signIn = useCallback(({ user: nextUser, token: nextToken, rememberSession = true }: SignInPayload) => {
    setUser(nextUser);
    setToken(nextToken);
    setIsSessionLoading(false);
    persistToken(rememberSession ? nextToken : null);
  }, []);

  const updateUser = useCallback((patch: Partial<SessionUser>) => {
    setUser((currentUser) => {
      if (!currentUser) {
        return currentUser;
      }

      return {
        ...currentUser,
        ...patch
      };
    });
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    setToken(null);
    setIsSessionLoading(false);
    persistToken(null);
  }, []);

  const value = useMemo<SessionContextValue>(
    () => ({
      user,
      token,
      isSessionLoading,
      isAuthenticated: user !== null && token !== null,
      signIn,
      updateUser,
      signOut
    }),
    [isSessionLoading, signIn, signOut, token, updateUser, user]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}
