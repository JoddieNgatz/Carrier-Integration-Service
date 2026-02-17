import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { RatingService } from './rating.service';
import { AllowAllGuard } from '../../auth/guards/allow-all.guard';
import { RatingRequest } from './interfaces/rating-request.interface';
import { RatingResponse } from './interfaces/rating-response.interface';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller()
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}
  @ApiTags('Rating')
  @Post('rating')
  @ApiOperation({ summary: 'Get rating for a shipment' })
  //ToDo: Add authentication guard
  @UseGuards(AllowAllGuard) //This is temporarily used to allow all requests to the rating endpoint
  postRating(@Body() request: RatingRequest): Promise<RatingResponse> {
    return this.ratingService.postRating(request);
  }
}
