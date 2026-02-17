import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RatingModule } from './features/rating/rating.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), RatingModule],
})
export class AppModule {}
