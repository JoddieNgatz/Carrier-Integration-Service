import { Module } from '@nestjs/common';
import { UpsAuthService } from './ups-auth/ups-auth.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [UpsAuthService],
  exports: [UpsAuthService],
})
export class AuthModule {}
