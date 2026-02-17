import { RatingRequest } from '../../../../features/rating/interfaces/rating-request.interface';

export interface UpsRatingRequest extends RatingRequest {
  serviceLevel?: 'ground' | 'express' | 'overnight' | string;
}
