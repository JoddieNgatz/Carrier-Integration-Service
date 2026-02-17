import { HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { UpsAuthService } from './ups-auth.service';

describe('UpsAuthService', () => {
  const now = 1_700_000_000_000;
  let service: UpsAuthService;
  let httpService: { axiosRef: { request: jest.Mock } };
  let configService: { get: jest.Mock };

  const createService = (
    overrides: Record<string, string | undefined> = {},
  ) => {
    const values: Record<string, string | undefined> = {
      UPS_OAUTH_URL: process.env.UPS_OAUTH_URL,
      UPS_CLIENT_ID: process.env.UPS_CLIENT_ID,
      UPS_CLIENT_SECRET: process.env.UPS_CLIENT_SECRET,
      UPS_MERCHANT_ID: process.env.UPS_MERCHANT_ID,
      UPS_TIMEOUT_MS: process.env.UPS_TIMEOUT_MS,
      ...overrides,
    };

    configService = {
      get: jest.fn((key: string) => values[key]),
    };

    httpService = {
      axiosRef: {
        request: jest.fn(),
      },
    };

    service = new UpsAuthService(
      configService as unknown as ConfigService,
      httpService as unknown as HttpService,
    );
  };

  beforeEach(() => {
    jest.spyOn(Date, 'now').mockReturnValue(now);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('throws 500 when UPS OAuth config is missing', async () => {
    createService({ UPS_CLIENT_SECRET: undefined });

    await expect(service.getAccessToken()).rejects.toBeInstanceOf(
      HttpException,
    );
    await expect(service.getAccessToken()).rejects.toMatchObject({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Missing UPS OAuth configuration',
    });
    expect(httpService.axiosRef.request).not.toHaveBeenCalled();
  });

  it('requests and caches token, parsing expires_in from string', async () => {
    createService();
    httpService.axiosRef.request.mockResolvedValue({
      data: {
        access_token: 'token-123',
        token_type: 'Bearer',
        expires_in: '3600',
      },
    });

    const firstToken = await service.getAccessToken();
    const secondToken = await service.getAccessToken();

    expect(firstToken).toBe('token-123');
    expect(secondToken).toBe('token-123');
    expect(httpService.axiosRef.request).toHaveBeenCalledTimes(1);
    expect(httpService.axiosRef.request).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'POST',
        url: process.env.UPS_OAUTH_URL,
        data: 'grant_type=client_credentials',
        timeout: 5000,
        headers: expect.objectContaining({
          'Content-Type': 'application/x-www-form-urlencoded',
          'x-merchant-id': '123456',
          Authorization: expect.stringMatching(/^Basic /),
        }),
      }),
    );
  });

  it('omits x-merchant-id header when merchant id is not configured', async () => {
    createService({ UPS_MERCHANT_ID: undefined });
    httpService.axiosRef.request.mockResolvedValue({
      data: {
        access_token: 'token-123',
        token_type: 'Bearer',
        expires_in: 900,
      },
    });

    await service.getAccessToken();

    const requestConfig = httpService.axiosRef.request.mock.calls[0][0];
    expect(requestConfig.headers['x-merchant-id']).toBeUndefined();
  });

  it('throws 502 when UPS OAuth response is malformed', async () => {
    createService();
    httpService.axiosRef.request.mockResolvedValue({
      data: {
        access_token: '',
        token_type: 'Bearer',
        expires_in: 'not-a-number',
      },
    });

    await expect(service.getAccessToken()).rejects.toMatchObject({
      status: HttpStatus.BAD_GATEWAY,
      message: 'Invalid UPS OAuth token response',
    });
  });
});
