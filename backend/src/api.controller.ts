import { Controller, Get, Query } from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios';

import { AxiosResponse } from 'axios';

@Controller('api')
export class ApiController {
	
	constructor(private readonly http_service: HttpService) {}

	@Get('auth/callback')
	async authCallback(@Query('code') code: string): Promise<string>
	{
		const client_id = 'u-s4t2ud-2c8d9db03c47fbff2b0498581e3badfacdf6e8a94f08c3c7338c2c5e27bb7f81';
		const client_secret = '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';
		
		const payload =
		{
			client_id: client_id,
			client_secret: client_secret,
			grant_type: 'authorization_code',
			code: code,
			redirect_uri: 'http://localhost:8080/api/auth/callback',
		};

		try {

			const token_response: AxiosResponse = await this.http_service.post('https://api.intra.42.fr/oauth/token', payload)
					.toPromise();

			const access_token = token_response.data.access_token;
			
			// Use access token to get user information
			const userResponse: AxiosResponse = await this.http_service.get('https://api.intra.42.fr/v2/me',
			{
				headers: { 'Authorization': `Bearer ${access_token}` }
			}).toPromise();

			return 'Auth successful';

		} catch (error) {
			console.log(error);
			return 'Auth failed';
		}
	}
}