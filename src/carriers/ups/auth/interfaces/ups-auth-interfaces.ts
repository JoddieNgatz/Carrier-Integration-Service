export interface UpsOauthResponse {
  access_token: string;
  token_type: string;
  expires_in: string | number;
}

export interface CachedToken {
  accessToken: string;
  expiresAt: number;
}
