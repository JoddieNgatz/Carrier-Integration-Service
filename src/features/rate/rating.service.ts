import { Injectable } from '@nestjs/common';
import { UpsRatingService } from '../../carriers/ups/rate/ups-rating.service';

@Injectable()
export class RatingService {
  constructor(private readonly upsRatingService: UpsRatingService) {}

  //The Rating API is used when rating or shopping a shipment.
  async postRating(): Promise<string> {
    const rate = await this.upsRatingService.getRate();
    return rate;
  }
}
