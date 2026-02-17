import { Inject, Injectable, Logger } from '@nestjs/common';
import { RATING_STRATEGIES, RatingStrategy } from './strategy/rating.strategy';
import { RatingRequest } from '../../carriers/ups/rating/interfaces/rating-request.interface';
import { RatingResponse } from '../../carriers/ups/rating/interfaces/rating-response.interface';

@Injectable()
export class RatingService {
  private readonly logger = new Logger(RatingService.name);
  constructor(
    @Inject(RATING_STRATEGIES)
    private readonly strategies: RatingStrategy[],
  ) {}

  //The Rating API is used when rating or shopping a shipment.
  //Using nest strategy pattern to add more carriers in the future
  //Client should provide the carrier name
  //Defaulting to using ups rating for now
  async postRating(
    request: RatingRequest,
    carrier = 'UPS',
  ): Promise<RatingResponse> {
    const strategy = this.strategies.find(
      ({ carrier: strategyCarrier }) => strategyCarrier === carrier,
    );

    if (!strategy) {
      this.logger.error(`No rating strategy found for "${carrier}"`);
      // defaulting to using ups rating for now
      //throw new NotFoundException(`No rating strategy found for "${carrier}"`);
    }

    return strategy.postRating(request);
  }
}
