import { RatingResponse } from '../../../carriers/ups/rating/interfaces/rating-response.interface';
import { RatingRequest } from '../../../carriers/ups/rating/interfaces/rating-request.interface';

export interface RatingStrategy {
  carrier: string;
  postRating(request: RatingRequest): Promise<RatingResponse>;
}

export const RATING_STRATEGIES = 'RATING_STRATEGIES';
