import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { HttpModule, HttpService } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/User';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'app',
      password: 'apppassword',
      database: 'transcendance',
      entities: [ User ],
      synchronize: false,
    }),
  ],
  controllers: [ApiController],
  providers: [],
})
export class AppModule { }
