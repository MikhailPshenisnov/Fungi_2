import { ApiError, requestJson } from '@shared/api';

export const USER_AGREEMENT_VERSION = '2026-04-21-v1';
export const PERSONAL_DATA_CONSENT_VERSION = '2026-04-21-v1';

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
  isUserAgreementAccepted: boolean;
  isPersonalDataProcessingConsentAccepted: boolean;
  userAgreementVersion: string;
  personalDataProcessingConsentVersion: string;
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
