import { Controller, Post, UseGuards } from '@nestjs/common';
import { RatingService } from './rating.service';
import { AllowAllGuard } from '../../auth/guards/allow-all.guard';

@Controller()
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Post('rating')
  @UseGuards(AllowAllGuard)
  postRating(): Promise<string> {
    return this.ratingService.postRating();
  }
}
