import { ApiError, requestJson } from '@shared/api';

interface TokenPayload {
  token?: string;
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

async function postAuth(path: string, body: LoginRequest | RegisterRequest): Promise<AuthResult> {
  const data = await requestJson<TokenPayload>(path, {
    method: 'POST',
    body
  });

  const token = typeof data.token === 'string' ? data.token : '';
  if (!token) {
    throw new ApiError('Сервер не вернул токен авторизации.');
  }

  return { token };
}

export function loginUser(request: LoginRequest) {
  return postAuth('/Authorization/LoginUser', request);
}

export function registerUser(request: RegisterRequest) {
  return postAuth('/Authorization/RegisterUser', request);
}
