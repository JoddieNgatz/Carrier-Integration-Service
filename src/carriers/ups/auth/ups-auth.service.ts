import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';

interface UpsOauthResponse {
  access_token: string;
  token_type: string;
  expires_in: string | number;
}

interface CachedToken {
  accessToken: string;
  expiresAt: number;
}

@Injectable()
export class UpsAuthService {
  private cached: CachedToken | null = null;
  private readonly skewMs = 30_000;
  private readonly upsOauthUrl: string;
  private readonly upsClientId: string;
  private readonly upsClientSecret: string;
  private readonly upsMerchantId: string;
  private readonly timeoutMs: number;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.upsOauthUrl = this.configService.get('UPS_OAUTH_URL');
    this.upsClientId = this.configService.get('UPS_CLIENT_ID');
    this.upsClientSecret = this.configService.get('UPS_CLIENT_SECRET');
    this.upsMerchantId = this.configService.get('UPS_MERCHANT_ID');
    this.timeoutMs = Number(this.configService.get('UPS_TIMEOUT_MS') ?? 5000);
  }

  async getAccessToken(): Promise<string> {
    if (this.cached && Date.now() < this.cached.expiresAt - this.skewMs) {
      return this.cached.accessToken;
    }

    if (!this.upsClientId || !this.upsClientSecret || !this.upsOauthUrl) {
      throw new HttpException(
        'Missing UPS OAuth configuration',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    const basicToken = Buffer.from(
      `${this.upsClientId}:${this.upsClientSecret}`,
    ).toString('base64');

    const response = await this.httpService.axiosRef.request<UpsOauthResponse>({
      method: 'POST',
      url: this.upsOauthUrl,
      headers: {
        Authorization: `Basic ${basicToken}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        ...(this.upsMerchantId ? { 'x-merchant-id': this.upsMerchantId } : {}),
      },
      data: 'grant_type=client_credentials',
      timeout: this.timeoutMs,
    });

    const { access_token, expires_in } = response.data ?? {};
    const expiresInSeconds =
      typeof expires_in === 'string'
        ? Number.parseInt(expires_in, 10)
        : expires_in;

    if (!access_token || !Number.isFinite(expiresInSeconds)) {
      throw new HttpException(
        'Invalid UPS OAuth token response',
        HttpStatus.BAD_GATEWAY,
      );
    }

    this.cached = {
      accessToken: access_token,
      expiresAt: Date.now() + expiresInSeconds * 1000,
    };
    return this.cached.accessToken;
  }
}
