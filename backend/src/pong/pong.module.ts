import { Module } from '@nestjs/common';
import { PongService } from './pong.service';
import { PongServer } from './pong.server';

@Module({
  providers: [PongService, PongServer]
})
export class PongModule {}
