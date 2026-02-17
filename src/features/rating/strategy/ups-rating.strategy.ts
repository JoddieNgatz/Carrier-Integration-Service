import { Injectable } from '@nestjs/common';
import { UpsRatingService } from '../../../carriers/ups/rating/ups-rating.service';
import { RatingStrategy } from './rating.strategy';
import { RatingRequest } from '../../../carriers/ups/rating/interfaces/rating-request.interface';
import { RatingResponse } from '../../../carriers/ups/rating/interfaces/rating-response.interface';

@Injectable()
export class UpsRatingStrategy implements RatingStrategy {
  readonly carrier = 'ups';

  constructor(private readonly upsRatingService: UpsRatingService) {}

  postRating(request: RatingRequest): Promise<RatingResponse> {
    return this.upsRatingService.postRating(request);
  }
}
