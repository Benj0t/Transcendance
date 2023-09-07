import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { HttpModule, HttpService } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [ApiController],
  providers: [],
})
export class AppModule {}
