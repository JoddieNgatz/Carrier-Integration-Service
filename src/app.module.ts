import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RatingModule } from './features/rate/rating.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), RatingModule],
})
export class AppModule {}
