import { RatingRequest } from '../interfaces/rating-request.interface';
import { RatingResponse } from '../interfaces/rating-response.interface';

export interface RatingStrategy {
  carrier: string;
  postRating(request: RatingRequest): Promise<RatingResponse>;
}
//This is used to inject the strategies into the rating service
export const RATING_STRATEGIES = 'RATING_STRATEGIES';
