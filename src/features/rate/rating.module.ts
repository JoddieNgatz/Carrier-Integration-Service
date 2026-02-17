import { Module } from '@nestjs/common';
import { RatingController } from './rating.controller';
import { RatingService } from './rating.service';
import { UpsModule } from '../../carriers/ups/ups.module';

@Module({
  imports: [UpsModule],
  controllers: [RatingController],
  providers: [RatingService],
})
export class RatingModule {}
