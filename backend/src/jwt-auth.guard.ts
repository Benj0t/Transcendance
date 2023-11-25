import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from './auth/auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}
  async canActivate(
    context: ExecutionContext,
  ):Promise<boolean>{
    try {
      const request = context.switchToHttp().getRequest();
      const {authorization} = request.headers;
      if (!authorization || authorization.trim() === '') {
        throw new UnauthorizedException('Please provide token');
      }
      const authToken = authorization.replace(/bearer/gim, '').trim();
      const jwtPayload = await this.authService.validateToken(authToken)
      request.jwtPayload = jwtPayload
      return true;
    }
    catch (error) {
      console.log("Auth error", error)
      throw new ForbiddenException(error.message);
    }
  }
}
