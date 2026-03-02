interface ApiExceptionDto {
  errorGroup?: string;
  errorMessage?: string;
}

interface ApiResponse<T> {
  data: T | null;
  errorMessage?: ApiExceptionDto | string | null;
}

interface TokenPayload {
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResult {
  token: string;
}

const apiBaseUrl = (import.meta.env.VITE_API_URL ?? '').trim().replace(/\/+$/, '');

function toApiUrl(path: string) {
  if (!apiBaseUrl) return path;
  return `${apiBaseUrl}${path.startsWith('/') ? path : `/${path}`}`;
}

function extractErrorMessage(payload: unknown): string | null {
  if (!payload || typeof payload !== 'object') return null;
  const candidate = payload as {
    errorMessage?: ApiExceptionDto | string | null;
    message?: string;
    Message?: string;
  };

  if (typeof candidate.errorMessage === 'string') return candidate.errorMessage;
  if (candidate.errorMessage && typeof candidate.errorMessage === 'object') {
    if (typeof candidate.errorMessage.errorMessage === 'string') {
      return candidate.errorMessage.errorMessage;
    }
  }
  if (typeof candidate.message === 'string') return candidate.message;
  if (typeof candidate.Message === 'string') return candidate.Message;
  return null;
}

async function postAuth(path: string, body: LoginRequest | RegisterRequest) {
  const response = await fetch(toApiUrl(path), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body)
  });

  const payload = (await response.json().catch(() => null)) as ApiResponse<TokenPayload> | null;

  if (!response.ok) {
    throw new Error(extractErrorMessage(payload) ?? 'Не удалось выполнить запрос.');
  }

  const token = payload?.data?.token;
  if (!token) {
    throw new Error(extractErrorMessage(payload) ?? 'Сервер не вернул токен авторизации.');
  }

  return { token } satisfies AuthResult;
}

export function loginUser(request: LoginRequest) {
  return postAuth('/Authorization/LoginUser', request);
}

export function registerUser(request: RegisterRequest) {
  return postAuth('/Authorization/RegisterUser', request);
}
