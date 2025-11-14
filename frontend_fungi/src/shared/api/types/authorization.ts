export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
}

export interface ValidateTokenRequest {
  token: string
}

export interface MaybeTokenResponse {
  token?: string
}