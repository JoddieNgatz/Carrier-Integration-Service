import { Injectable, Logger } from '@nestjs/common';
import { UpsAuthService } from '../auth/ups-auth.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { CarrierError } from '../../../common/errors/carrier-error';
import { RatingRequest } from '../../../features/rating/interfaces/rating-request.interface';
import { RatingResponse } from '../../../features/rating/interfaces/rating-response.interface';
import {
  fromUpsRateResponse,
  toUpsRateRequest,
} from './mappers/ups-rating.mappers';
import { UpsRateResponseSchema } from './schemas/ups-rating.shemas';

@Injectable()
export class UpsRatingService {
  private readonly logger = new Logger(UpsRatingService.name);
  private readonly upsRatingUrl: string;
  private readonly timeoutMs: number;
  private readonly baseUrl: string;
  constructor(
    private readonly upsAuthService: UpsAuthService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.upsRatingUrl = this.configService.get('UPS_RATING_URL');
    this.timeoutMs = Number(this.configService.get('UPS_TIMEOUT_MS') ?? 5000);
    this.baseUrl = this.configService.get('UPS_BASE_URL');
  }

  async postRating(request: RatingRequest): Promise<RatingResponse> {
    if (!request.packages?.length) {
      throw new CarrierError(
        'VALIDATION_ERROR',
        'At least one package is required',
        {
          carrier: 'UPS',
        },
      );
    }
    if (!this.baseUrl) {
      throw new CarrierError('INTERNAL_ERROR', 'Missing UPS base URL', {
        carrier: 'UPS',
      });
    }

    const token = await this.upsAuthService.getAccessToken();
    const upsRequest = toUpsRateRequest(request);

    const response = await this.httpService.axiosRef.request<unknown>({
      method: 'POST',
      url: `${this.upsRatingUrl}`,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      data: upsRequest,
      timeout: this.timeoutMs,
    });

    if (response.status === 401 || response.status === 403) {
      throw new CarrierError('AUTH_ERROR', 'UPS auth rejected request', {
        carrier: 'UPS',
        details: { statusCode: response.status, rawResponse: response.data },
      });
    }

    if (response.status === 429) {
      throw new CarrierError('RATE_LIMITED', 'UPS rate limited request', {
        carrier: 'UPS',
        details: { statusCode: response.status, rawResponse: response.data },
      });
    }

    if (response.status < 200 || response.status >= 300) {
      throw new CarrierError('CARRIER_API_ERROR', 'UPS rating request failed', {
        carrier: 'UPS',
        details: { statusCode: response.status, rawResponse: response.data },
      });
    }

    const parsed = UpsRateResponseSchema.safeParse(response.data);
    if (!parsed.success) {
      throw new CarrierError(
        'CARRIER_API_ERROR',
        'Malformed UPS rating response',
        {
          carrier: 'UPS',
          details: { rawResponse: response.data },
        },
      );
    }

    const rates = fromUpsRateResponse(parsed.data);
    if (!rates.length) {
      throw new CarrierError('CARRIER_API_ERROR', 'No UPS rates returned', {
        carrier: 'UPS',
        details: { rawResponse: response.data },
      });
    }

    return rates[0];
  }
}
