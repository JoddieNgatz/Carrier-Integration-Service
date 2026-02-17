import { Test, TestingModule } from '@nestjs/testing';
import { RatingController } from './rating.controller';
import { RatingService } from './rating.service';

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
    it('should call service with provided carrier', async () => {
      postRating.mockResolvedValue('mocked-rate');

      await expect(ratingController.postRating('ups')).resolves.toBe('mocked-rate');
      expect(postRating).toHaveBeenCalledWith('ups');
    });
  });
});
