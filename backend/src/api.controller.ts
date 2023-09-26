import { Controller, Get, Query, Res, Param, NotFoundException, HttpStatus, UseGuards } from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { Response } from 'express';
import { UserEntity } from './entities/user.entity';
import { UserService } from './entities/user.service';
import * as imageToBase64 from 'image-to-base64';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

/**
 * Authentication pearl with API 42 by intercepting the response and exchanging the
 * code for a token, if successful, the user is redirected to the game page.
 * 
 * @author Komqdo
 */

@Controller('api')
export class ApiController {

  constructor(
    private readonly http_service: HttpService,
    private readonly user_service: UserService,
    private readonly auth_service: AuthService
  ) { }

  /**
   * @param id  The user id.
   * 
   * @returns   The user or the specified id.
   * 
   * @author Komqdo 
   */

  @Get('user/:id')
  @UseGuards(JwtAuthGuard)
  async getUserById(@Param('id') id: number): Promise<UserEntity | { message: string }> {
    const user = await this.user_service.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found.`);
    }
    return user;
  }

  /**
   * @param id The user id
   * 
   * @returns  The user avatar.
   * 
   * @author Komqdo
   */

  @Get('user/:id/avatar')
  @UseGuards(JwtAuthGuard)
  async getUserAvatar(@Param('id') id: number, @Res() res: Response): Promise<void> {
    const user = await this.user_service.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found.`);
    }

    if (!user.avatar_base64) {
      res.status(HttpStatus.NOT_FOUND).send('User does not have an avatar.');
      return;
    }

    res.setHeader('Content-Type', 'image/png');
    res.send(Buffer.from(user.avatar_base64, 'base64'));
  }

  /**
   * Authentificate an user and exchange the specified code with
   * an access token, register the user if needed, then returns it and
   * redirect to http://localhost:3000/.
   * 
   * @param code The code gived by 42 api.
   * 
   * @returns The connected user.
   * 
   * @author Komqdo
   */

  @Get('auth/callback')
  async authCallback(@Query('code') code: string, @Res() res: Response): Promise<void> {

    /**
     * Client id and secret
     */

    const client_id = 'u-s4t2ud-2c8d9db03c47fbff2b0498581e3badfacdf6e8a94f08c3c7338c2c5e27bb7f81';
    const client_secret = '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';

    /**
     * Build a payload with the arguments for the
     * oauth/token request.
     */

    const payload = {
      client_id: client_id,
      client_secret: client_secret,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: 'http://localhost:8080/api/auth/callback',
    };

    try {

      /**
       * Sends a POST request on /oauth/token
       * with the payload.
       */

      const token_response: AxiosResponse = await this.http_service
        .post('https://api.intra.42.fr/oauth/token', payload)
        .toPromise();

      /**
       * Then get the exchanged access token from the response.
       */

      const access_token = token_response.data.access_token;

      /**
       * Get user informations using the Bearer.
       */

      const user_response: AxiosResponse = await this.http_service
        .get('https://api.intra.42.fr/v2/me',
          {
            headers: { 'Authorization': `Bearer ${access_token}` }
          }).toPromise();

      const user_42_id = user_response.data.id;
      const user_42_nickname = user_response.data.login;
      const user_42_avatar_url = user_response.data.image.versions.large;
      const user_42_avatar_base64 = await imageToBase64(user_42_avatar_url);

      /**
       * Get the user from the database using upsert.
       */

      const user = await this.user_service.upsertUser(user_42_id, user_42_nickname, user_42_avatar_base64);

      if (!user) {
        console.log(new Error('Upsert failed.'));
        res.status(HttpStatus.NOT_FOUND).send('Authentication failed.');
        return;
      }

      /**
       * Redirect the user to main page.
       */

      res.redirect('http://localhost:3000/');

      const token = await this.auth_service.createToken({ username: user.nickname, sub: user.id });

      res.status(HttpStatus.OK).json({ access_token: token });

    } catch (error) {

      console.log(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Authentication failed.');
    }
  }
}