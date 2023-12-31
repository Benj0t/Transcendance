import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../jwt.config';
import { generateSecret, verify } from '2fa-util';

export type JwtPayload = {
  username: string;
  sub: number;
};

@Injectable()
export class AuthService {
  private secrets: Map<number, string> = new Map();
  constructor(private jwt_service: JwtService) { }

  async createToken(payload: JwtPayload): Promise<string> {
    return this.jwt_service.sign(payload, {
      secret: jwtConstants.secret,
      expiresIn: jwtConstants.expiresIn,
    });
  }

  async validateToken(token: string): Promise<JwtPayload> {
      return this.jwt_service.verify(token, {
        secret: jwtConstants.secret,
      });
  }

  async generateQR(client_nickname: any, client_id: any): Promise<any> {
    const output = await generateSecret(client_nickname, 'Transcendance');
    this.secrets.set(client_id, output.secret);
    return output;
  }

  async getSecret(twoFactor: any): Promise<string> {
    return this.secrets.get(twoFactor.client_secret);
  }

  async verifyTwoFactor(code: string, secret: string): Promise<boolean> {
    const test = await (verify(code, secret));
    return test;
  }
}
