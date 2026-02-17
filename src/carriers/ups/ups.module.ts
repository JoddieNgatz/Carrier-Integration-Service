import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { UpsAuthService } from './auth/ups-auth.service';
import { UpsRatingService } from './rating/ups-rating.service';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [UpsAuthService, UpsRatingService],
  exports: [UpsAuthService, UpsRatingService],
})
export class UpsModule {}
