import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './jwt.config';

@Injectable()
export class AuthService {
  constructor(private jwt_service: JwtService) { }

  async createToken(payload: any): Promise<string> {
    return this.jwt_service.sign(payload, {
      secret: jwtConstants.secret,
      expiresIn: jwtConstants.expiresIn,
    });
  }

  async validateToken(token: string): Promise<any> {
    try {
      return this.jwt_service.verify(token, {
        secret: jwtConstants.secret,
      });
    } catch (error) {
      return null;
    }
  }
}