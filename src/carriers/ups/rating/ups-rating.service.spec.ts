import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { CarrierError } from '../../../common/errors/carrier-error';
import { RatingRequest } from '../../../features/rating/interfaces/rating-request.interface';
import { UpsAuthService } from '../auth/ups-auth.service';
import { UpsRatingService } from './ups-rating.service';

describe('UpsRatingService', () => {
  let service: UpsRatingService;
  let upsAuthService: { getAccessToken: jest.Mock };
  let httpService: { axiosRef: { request: jest.Mock } };
  let configService: { get: jest.Mock };

  const validRequest: RatingRequest = {
    carrier: 'ups',
    origin: {
      street1: '1 Main St',
      city: 'Austin',
      state: 'TX',
      postalCode: '78701',
      countryCode: 'US',
    },
    destination: {
      street1: '2 Market St',
      city: 'Dallas',
      state: 'TX',
      postalCode: '75201',
      countryCode: 'US',
    },
    packages: [{ weight: { value: 2, unit: 'lb' } }],
  };

  const createService = (
    overrides: Record<string, string | undefined> = {},
  ): void => {
    const values: Record<string, string | undefined> = {
      UPS_BASE_URL: 'https://onlinetools.ups.com',
      UPS_TIMEOUT_MS: '5000',
      ...overrides,
    };

    upsAuthService = {
      getAccessToken: jest.fn().mockResolvedValue('access-token'),
    };

    httpService = {
      axiosRef: {
        request: jest.fn(),
      },
    };

    configService = {
      get: jest.fn((key: string) => values[key]),
    };

    service = new UpsRatingService(
      upsAuthService as unknown as UpsAuthService,
      httpService as unknown as HttpService,
      configService as unknown as ConfigService,
    );
  };

  beforeEach(() => {
    createService();
  });

  it('returns first mapped rate on success', async () => {
    httpService.axiosRef.request.mockResolvedValue({
      status: 200,
      data: {
        RatingResponse: {
          RatedShipment: [
            {
              Service: { Code: '03', Description: 'Ground' },
              TotalCharges: { CurrencyCode: 'USD', MonetaryValue: '12.34' },
              NegotiatedRateCharges: {
                TotalCharge: { CurrencyCode: 'USD', MonetaryValue: '10.01' },
              },
              GuaranteedDelivery: {
                BusinessDaysInTransit: '2',
                DeliveryByTime: '16:30',
                ScheduledDeliveryDate: '2026-02-19',
              },
            },
          ],
        },
      },
    });

    await expect(service.postRating(validRequest)).resolves.toEqual({
      carrier: 'UPS',
      serviceCode: '03',
      serviceName: 'Ground',
      totalCharge: {
        amount: 12.34,
        currency: 'USD',
      },
      NegotiatedRateCharges: {
        TotalCharge: { CurrencyCode: 'USD', MonetaryValue: '10.01' },
      },
      GuaranteedDelivery: {
        BusinessDaysInTransit: '2',
        DeliveryByTime: '16:30',
        ScheduledDeliveryDate: '2026-02-19',
      },
    });
    expect(upsAuthService.getAccessToken).toHaveBeenCalledTimes(1);
    expect(httpService.axiosRef.request).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'POST',
        url: 'https://onlinetools.ups.com/api/rating/v1/Rate',
        timeout: 5000,
        headers: expect.objectContaining({
          Authorization: 'Bearer access-token',
          'Content-Type': 'application/json',
          Accept: 'application/json',
        }),
      }),
    );
  });

  it('throws validation error when no packages are provided', async () => {
    await expect(
      service.postRating({
        ...validRequest,
        packages: [],
      }),
    ).rejects.toMatchObject({
      code: 'VALIDATION_ERROR',
      message: 'At least one package is required',
      carrier: 'UPS',
    });
    expect(httpService.axiosRef.request).not.toHaveBeenCalled();
  });

  it('throws internal error when UPS base URL is missing', async () => {
    createService({ UPS_BASE_URL: undefined });

    await expect(service.postRating(validRequest)).rejects.toMatchObject({
      code: 'INTERNAL_ERROR',
      message: 'Missing UPS base URL',
      carrier: 'UPS',
    });
    expect(httpService.axiosRef.request).not.toHaveBeenCalled();
  });

  it('throws carrier error when response payload is malformed', async () => {
    httpService.axiosRef.request.mockResolvedValue({
      status: 200,
      data: { invalid: true },
    });

    await expect(service.postRating(validRequest)).rejects.toMatchObject({
      code: 'CARRIER_API_ERROR',
      message: 'Malformed UPS rating response',
      carrier: 'UPS',
    });
  });

  it('throws auth error on 401/403 status', async () => {
    httpService.axiosRef.request.mockResolvedValue({
      status: 401,
      data: { message: 'unauthorized' },
    });

    await expect(service.postRating(validRequest)).rejects.toMatchObject({
      code: 'AUTH_ERROR',
      message: 'UPS auth rejected request',
      carrier: 'UPS',
      details: {
        statusCode: 401,
      },
    });
  });

  it('throws rate-limited error on 429 status', async () => {
    httpService.axiosRef.request.mockResolvedValue({
      status: 429,
      data: { message: 'too many requests' },
    });

    await expect(service.postRating(validRequest)).rejects.toMatchObject({
      code: 'RATE_LIMITED',
      message: 'UPS rate limited request',
      carrier: 'UPS',
      details: {
        statusCode: 429,
      },
    });
  });

  it('throws carrier API error when no rates are returned', async () => {
    httpService.axiosRef.request.mockResolvedValue({
      status: 200,
      data: {
        RatingResponse: {
          RatedShipment: [],
        },
      },
    });

    await expect(service.postRating(validRequest)).rejects.toMatchObject({
      code: 'CARRIER_API_ERROR',
      message: 'No UPS rates returned',
      carrier: 'UPS',
    });
  });

  it('throws carrier API error for non-2xx responses', async () => {
    httpService.axiosRef.request.mockResolvedValue({
      status: 500,
      data: { message: 'server error' },
    });

    await expect(service.postRating(validRequest)).rejects.toMatchObject({
      code: 'CARRIER_API_ERROR',
      message: 'UPS rating request failed',
      carrier: 'UPS',
      details: {
        statusCode: 500,
      },
    });
  });

  it('throws carrier API error when charge amount is not numeric', async () => {
    httpService.axiosRef.request.mockResolvedValue({
      status: 200,
      data: {
        RatingResponse: {
          RatedShipment: [
            {
              Service: { Code: '03', Description: 'Ground' },
              TotalCharges: { CurrencyCode: 'USD', MonetaryValue: 'abc' },
            },
          ],
        },
      },
    });

    await expect(service.postRating(validRequest)).rejects.toBeInstanceOf(
      CarrierError,
    );
    await expect(service.postRating(validRequest)).rejects.toMatchObject({
      code: 'CARRIER_API_ERROR',
      message: 'Invalid UPS monetary value',
      carrier: 'UPS',
    });
  });
});
