import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { RatingService } from './rating.service';
import { AllowAllGuard } from '../../auth/guards/allow-all.guard';
import { RatingRequest } from '../../carriers/ups/rating/interfaces/rating-request.interface';
import { RatingResponse } from '../../carriers/ups/rating/interfaces/rating-response.interface';

@Controller()
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Post('rating')
  @UseGuards(AllowAllGuard)
  postRating(@Body() request: RatingRequest): Promise<RatingResponse> {
    return this.ratingService.postRating(request);
  }
}
