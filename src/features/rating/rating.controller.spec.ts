import { Test, TestingModule } from '@nestjs/testing';
import { RatingController } from './rating.controller';
import { RatingService } from './rating.service';
import { RatingRequest } from './interfaces/rating-request.interface';
import { RatingResponse } from './interfaces/rating-response.interface';

describe('RatingController', () => {
  let ratingController: RatingController;
  const postRating = jest.fn();

  beforeEach(async () => {
    postRating.mockReset();

    const app: TestingModule = await Test.createTestingModule({
      controllers: [RatingController],
      providers: [
        {
          provide: RatingService,
          useValue: { postRating },
        },
      ],
    }).compile();

    ratingController = app.get<RatingController>(RatingController);
  });

  describe('postRating', () => {
    it('should pass request to the service', async () => {
      const request: RatingRequest = {
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
          postalCode: '75001',
          countryCode: 'US',
        },
        packages: [{ weight: { value: 1, unit: 'lb' } }],
      };
      const response: RatingResponse = {
        carrier: 'UPS',
        serviceCode: '03',
        serviceName: 'Ground',
        totalCharge: {
          amount: 12.34,
          currency: 'USD',
        },
      };
      postRating.mockResolvedValue(response);

      await expect(ratingController.postRating(request)).resolves.toEqual(response);
      expect(postRating).toHaveBeenCalledWith(request);
    });
  });
});
