import { Module } from '@nestjs/common';
import { RatingController } from './rating.controller';
import { RatingService } from './rating.service';
import { UpsModule } from '../../carriers/ups/ups.module';
import { RATING_STRATEGIES } from './strategy/rating.strategy';
import { UpsRatingStrategy } from './strategy/ups-rating.strategy';

@Module({
  imports: [UpsModule],
  controllers: [RatingController],
  providers: [
    RatingService,
    UpsRatingStrategy,
    {
      provide: RATING_STRATEGIES,
      useFactory: (upsRatingStrategy: UpsRatingStrategy) => [upsRatingStrategy],
      inject: [UpsRatingStrategy],
    },
  ],
})
export class RatingModule {}
