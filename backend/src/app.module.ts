import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiController } from './api.controller';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './jwt.config';
import { UserModule } from './entities/user.module';
import { UserEntity } from './entities/user.entity';
import { PongModule } from './pong/pong.module';
import { UserHasFriendEntity } from './entities/user_has_friend.entity';
import { UserHasBlockedUserEntity } from './entities/user_has_blocked_user.entity';
import { AchievementEntity } from './entities/achievement.entity';
import { MatchEntity } from './entities/match.entity';
import { RankEntity } from './entities/rank.entity';
import { ChannelHasBannedUserEntity } from './entities/channel_has_banned_user.entity';
import { ChannelHasMemberEntity } from './entities/channel_has_member.entity';
import { ChannelHasMessageEntity } from './entities/channel_has_message.entity';
import { ChannelEntity } from './entities/channel.entity';
import { ChannelModule } from './entities/channel.module';

@Module({
  imports: [
    HttpModule,
    UserModule,
    ChannelModule,
    PongModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      // if using docker containter, set host to postgres, else set host: 'localhost'
      host: 'localhost',
      port: 5432,
      username: 'app',
      password: 'apppassword',
      database: 'transcendance',
      // username: env("POSTGRES_USER"),
      // password: env("POSTGRES_PASSWORD"),
      // database: env("POSTGRES_DB"),
      entities: [ UserEntity, UserHasFriendEntity, UserHasBlockedUserEntity, AchievementEntity, MatchEntity, RankEntity,
          ChannelHasBannedUserEntity, ChannelHasMemberEntity, ChannelHasMessageEntity, ChannelEntity ],
      synchronize: false,
    }),
    PassportModule.register({}),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn }
    })
  ],
  controllers: [ApiController],
  providers: [AuthService],
  exports: [AuthService]})
export class AppModule {}
