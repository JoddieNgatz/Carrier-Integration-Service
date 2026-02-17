import { Controller, Post } from '@nestjs/common';
import { RatingService } from './rating.service';

@Controller()
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Post('rating')
  getHello(): string {
    return this.ratingService.getHello();
  }
}
