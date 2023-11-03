import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../jwt.config';
import { generateSecret, verify } from '2fa-util';

@Injectable()
export class AuthService {
  private secrets: Map<number, string> = new Map();
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

  async generateQR(client_nickname: any, client_id: any): Promise<any> {
    const output = await generateSecret(client_nickname, 'Transcendance');
    // stock secret -> db
    this.secrets.set(client_id, output.secret);           // set new generated secret at key=userId
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