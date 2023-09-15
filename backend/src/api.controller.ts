import { Controller, Get, Query, Res } from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { Response } from 'express';

/**
 * Authentication pearl with API 42 by intercepting the response and exchanging the
 * code for a token, if successful, the user is redirected to the game page.
 * 
 * @author Komqdo
 */

@Controller('api')
export class ApiController {

  constructor(private readonly http_service: HttpService) { }

  @Get('auth/callback')
  async authCallback(@Query('code') code: string, @Res() res: Response): Promise<void>
  {
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

      const userResponse: AxiosResponse = await this.http_service
              .get('https://api.intra.42.fr/v2/me',
              {
                  headers: { 'Authorization': `Bearer ${access_token}` }
              }).toPromise();

      /**
       * Redirect the user to main page.
       */

      res.redirect('http://localhost:3000/');

    } catch (error) {
      
      console.log(error);
      res.send('Authentication failed.');
    }
  }
}