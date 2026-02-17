import { Injectable } from '@nestjs/common';
import { UpsRatingService } from '../../../carriers/ups/rating/ups-rating.service';
import { RatingStrategy } from './rating.strategy';
import { RatingRequest } from '../interfaces/rating-request.interface';
import { RatingResponse } from '../interfaces/rating-response.interface';

@Injectable()
export class UpsRatingStrategy implements RatingStrategy {
  readonly carrier = 'ups';

  constructor(private readonly upsRatingService: UpsRatingService) {}
  //Each carrier would have its own strategy to handle the rating request so we would add Fedex strategy for example
  postRating(request: RatingRequest): Promise<RatingResponse> {
    return this.upsRatingService.postRating(request);
  }
}
