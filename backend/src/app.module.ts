import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiController } from './api.controller';
import { UserEntity } from './entities/user.entity';
import { MatchEntity } from './entities/match.entity';
import { RankEntity } from './entities/rank.entity';
import { AchievementEntity } from './entities/achievement.entity';
import { UserModule } from './entities/user.module';

@Module({
  imports: [
    HttpModule,
    UserModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'app',
      password: 'apppassword',
      database: 'transcendance',
      entities: [ UserEntity, MatchEntity, RankEntity, AchievementEntity ],
      synchronize: false,
    }),
  ],
  controllers: [ApiController],
  providers: [],
})
export class AppModule {}
