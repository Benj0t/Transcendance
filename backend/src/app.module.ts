import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiController } from './api.controller';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './jwt.config';
import { UserModule } from './entities/user.module';
import { UserEntity } from './entities/user.entity';
import { PongModule } from './pong/pong.module';

@Module({
  imports: [
    // HttpModule,
    // UserModule,
    PongModule,
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: 'localhost',
    //   port: 5432,
    //   username: 'app',
    //   password: 'apppassword',
    //   database: 'transcendance',
    //   entities: [ UserEntity ],
    //   synchronize: true,
    // }),
    // PassportModule.register({}),
    // JwtModule.register({
    //   secret: jwtConstants.secret,
    //   signOptions: { expiresIn: jwtConstants.expiresIn }
    // })
  ],
  // controllers: [ApiController],
  // providers: [AuthService],
  // exports: [AuthService]
})
export class AppModule {}
