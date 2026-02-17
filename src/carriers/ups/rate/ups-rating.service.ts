import { Injectable } from '@nestjs/common';
import { UpsAuthService } from '../auth/ups-auth.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UpsRatingService {
  constructor(
    private readonly upsAuthService: UpsAuthService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getRate(): Promise<string> {
    const accessToken = await this.upsAuthService.getAccessToken();
    const response = await this.httpService.axiosRef.request({
      method: 'POST',
      url: this.configService.get('UPS_RATING_URL'),
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    return JSON.stringify(response.data);
  }
}
