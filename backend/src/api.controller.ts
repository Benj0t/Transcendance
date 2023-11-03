import { Controller, Get, Query, Res, Param, NotFoundException, HttpStatus, UseGuards, Delete, Post, Body, BadRequestException, Patch, InternalServerErrorException } from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { Response } from 'express';
import { UserEntity } from './entities/user.entity';
import { UserService } from './entities/user.service';
import * as imageToBase64 from 'image-to-base64';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UserHasFriendEntity } from './entities/user_has_friend.entity';
import { MatchEntity } from './entities/match.entity';
import { UserHasBlockedUserEntity } from './entities/user_has_blocked_user.entity';
import { ChannelService } from './entities/channel.service';

/**
 * Authentication pearl with API 42 by intercepting the response and exchanging the
 * code for a token, if successful, the user is redirected to the game page.
 * 
 * @author Komqdo
 */

@Controller('api')
export class ApiController {

  //TODO route pour check JWT

  constructor(
    private readonly http_service: HttpService,
    private readonly user_service: UserService,
    private readonly channel_service: ChannelService,
    private readonly auth_service: AuthService
  ) { }

   /**
   * @returns   The users
   * 
   * @author Komqdo
   */
  
  @Get('valid-jwt/')
  @UseGuards(JwtAuthGuard)
  validJWT(): { message: string } {
    return ({ message: "valid jwt"});
  }

  /**
   * @returns   The users
   * 
   * @author Komqdo
   */
  
  @Get('user/')
  @UseGuards(JwtAuthGuard)
  getUser(): Promise<UserEntity[] | { message: string }> {
    return this.user_service.findAll().catch(error => {
      console.error("Error fetching users: ", error);
      return { message: 'No user in database.' };
    });
  }

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
   * Get the avatar for an user.
   * 
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
   * Update the avatar for a user.
   *
   * @param id The user id.
   * @param avatar_base64 The new avatar in base64 format.
   * @param res The HTTP response.
   * 
   * @author Komqdo
   */

  @Post('user/:id/avatar')
  @UseGuards(JwtAuthGuard)
  async updateUserAvatar(
    @Param('id') id: number,
    @Body('avatar_base64') avatar_base64: string,
    @Res() res: Response,
  ): Promise<void> {

    try {

      const tmp = await this.user_service.updateAvatar(id, avatar_base64);

      if (!tmp) {
        res.status(HttpStatus.NOT_FOUND).send('User not found.');
        return;
      }

      res.status(HttpStatus.OK).json(tmp);

    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Avatar update failed.');
    }
  }

  /**
   * Get the friend relationships for an user.
   * 
   * @param id  The user id
   * @returns   The friend relationships for the specified user.
   */
  
  @Get('user/:id/friends')
  @UseGuards(JwtAuthGuard)
  async getUserFriends(@Param('id') id: number): Promise<UserHasFriendEntity[]> {
    try {

      const friends = await this.user_service.getFriends(id);

      return friends;

    } catch (error) {
      throw new NotFoundException('Error: ' + error);
    }
  }

  /**
   * Add a friend for an user.
   * 
   * @param user_id   The user id.
   * @param friend_id The friend id.
   * 
   * @returns         The callback message. 
   * 
   * @author Komqdo
   */

  @Post('user/:id/friends')
  @UseGuards(JwtAuthGuard)
  async addFriend(
    @Param('id') user_id: number,
    @Query('friend_id') friend_id: number,
  ): Promise<{ message: string }> {

    try {

      const message = await this.user_service.addFriend(user_id, friend_id);
      return { message };

    } catch (error) {
      throw new NotFoundException(`Not found: ` + error);
    }
  }

  /**
   * Delete a friend for an user.
   * 
   * @param user_id   The user id
   * @param friend_id The friend id
   * @returns         The callback message.
   * 
   * @author Komqdo
   */

  @Delete('user/:id/friends')
  @UseGuards(JwtAuthGuard)
  async removeFriend(
    @Param('id') user_id: number,
    @Query('friend_id') friend_id: number,
  ): Promise<{ message: string }> {

    try {
      const message = await this.user_service.removeFriend(user_id, friend_id);
      return { message };

    } catch (error) {
      throw new NotFoundException(`Not found: ` + error);
    }
  }

  /**
   * Get the match history for an user.
   * 
   * @param id  The user id.
   * 
   * @returns   The match history for the specified user.
   * 
   * @author Komqdo
   */

  @Get('user/:id/matches')
  @UseGuards(JwtAuthGuard)
  async getUserMatches(@Param('id') id: number): Promise<MatchEntity[]> {

    try {

      const matches = await this.user_service.getMatches(id);

      return matches;

    } catch (error) {
      throw new NotFoundException('Error: ' + error);
    }
  }

  /**
   * Add a match.
   * 
   * @param user_id     The user id. 
   * @param opponent_id His opponent id.
   * @param winner_id   The id of the user that won the match.
   * 
   * @returns The feedback message.
   * 
   * @author Komqdo
   */

  @Post('user/:id/matches')
  @UseGuards(JwtAuthGuard)
  async addMatch(
    @Param('id') user_id: number,
    @Query('opponent_id') opponent_id: number,
    @Query('winner_id') winner_id: number,
  ): Promise<{ message: string }> {

    try {

      const message = await this.user_service.addMatch(user_id, opponent_id, winner_id);
      return { message };

    } catch (error) {
      throw new NotFoundException(`Not found: ` + error);
    }
  }
  
  /**
   * Get the blocked users for an user.
   * 
   * @param id The user id.
   * 
   * @returns The blocked users for the specified user.
   * 
   * @author Komqdo
   */

  @Get('user/:id/blockeds')
  @UseGuards(JwtAuthGuard)
  async getUserBlockedUsers(@Param('id') id: number): Promise<UserHasBlockedUserEntity[]> {

    try {

      const blockedUsers = await this.user_service.getBlockeds(id);

      return blockedUsers;

    } catch (error) {
      throw new NotFoundException(`Not found: ` + error);
    }
  }
  
  /**
   * Block an user for an user.
   * 
   * @param user_id           The user id.
   * @param blocked_user_id   The user id to block.
   * 
   * @returns                 The feedback message.
   * 
   * @author Komqdo
   */

  @Post('user/:id/blockeds')
  @UseGuards(JwtAuthGuard)
  async blockUser(
    @Param('id') user_id: number,
    @Query('blocked_id') blocked_user_id: number,
  ): Promise<{ message: string }> {

    try {

      const message = await this.user_service.blockUser(user_id, blocked_user_id);
      return { message };

    } catch (error) {
      throw new NotFoundException(`Not found: ` + error);
    }
  }

  /**
   * Unblock an user for an user.
   * 
   * @param user_id         The user id. 
   * @param unblocked_id    The user id to unblock.
   * 
   * @returns               The feedback message.
   * 
   * @author Komqdo
   */

  @Delete('user/:id/blockeds')
  @UseGuards(JwtAuthGuard)
  async unblockUser(
    @Param('id') user_id: number,
    @Query('unblocked_id') unblocked_id: number,
  ): Promise<{ message: string }> {

    try {
      const message = await this.user_service.unblockUser(user_id, unblocked_id);
      return { message };
    } catch (error) {
      throw new NotFoundException(`Not found: ` + error);
    }
  }

  // @Get('user/:id/chat/:channel_id/messages')
  // @UseGuards(JwtAuthGuard)
  // async getChannelMessages(
  //   @Param('id') id: number,
  //   @Param('channel_id') channel_id: number
  // ): Promise<ChannelMessageEntity[]> {
  //   try {
  //     const channelMessages = await this.user_service.getMessages(id, channel_id);
  //     return channelMessages;
  //   } catch (error) {
  //     throw new NotFoundException(`User with id ${id} not found.`);
  //   }
  // }

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

    const client_id = 'u-s4t2ud-19e5bce000defc36a67ba010b01a62700de81e7f46c1611ccde06b4057bca6d5';
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
      const token = await this.auth_service.createToken({ username: user.nickname, sub: user.id });
      res.redirect(`http://localhost:3000/auth/callback?jwt=${token}`);
    } catch (error) {
      console.log(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Authentication failed.');
    }
  }

  @Post()
  createChannel(@Body() body: { title: string; password: string; members: number[] }) {
    return this.channel_service.createChannel(body.title, body.password, body.members);
  }

  @Get('/user/:user/channels')
  getUserChannels(@Param('user') userId: number) {
    return this.channel_service.getUserChannels(userId);
  }

  @Delete('/:channel_id')
  deleteChannel(@Param('channel_id') channelId: number) {
    return this.channel_service.deleteChannel(channelId);
  }

  @Patch('/:channel_id')
  updateChannel(@Param('channel_id') channelId: number, @Body() updateData: any) {
    
  }

  @Get('/:channel_id/messages')
  getMessages(@Param('channel_id') channelId: number) {
    return this.channel_service.getMessages(channelId);
  }

  @Post('/:channel_id/messages')
  sendMessage(
    @Param('channel_id') channelId: number,
    @Body() body: { userId: number; message: string },
  ) {
    return this.channel_service.sendMessage(body.userId, channelId, body.message);
  }

  @Post('/:channel_id/mute')
  muteUser(
    @Param('channel_id') channelId: number,
    @Body() body: { moderatorId: number; targetId: number; muteTime: string },
  ) {
    return this.channel_service.muteUser(body.moderatorId, body.targetId, channelId, body.muteTime);
  }

  @Delete('/:channel_id/mute')
  unmuteUser(
    @Param('channel_id') channelId: number,
    @Body() body: { moderatorId: number; targetId: number },
  ) {
    return this.channel_service.unmuteUser(body.moderatorId, body.targetId, channelId);
  }

  @Post('/:channel_id/kick')
  kickUser(
    @Param('channel_id') channelId: number,
    @Body() body: { moderatorId: number; targetId: number },
  ) {
    return this.channel_service.kickUser(body.moderatorId, body.targetId, channelId);
  }

  @Post('/:channel_id/ban')
  banUser(
    @Param('channel_id') channelId: number,
    @Body() body: { moderatorId: number; targetId: number; banTime: string },
  ) {
    return this.channel_service.banUser(body.moderatorId, body.targetId, channelId, body.banTime);
  }

  @Delete('/:channel_id/ban')
  pardonUser(
    @Param('channel_id') channelId: number,
    @Body() body: { moderatorId: number; targetId: number },
  ) {
    return this.channel_service.pardonUser(body.moderatorId, body.targetId, channelId);
  }

  @Post('/:channel_id/op')
  opUser(
    @Param('channel_id') channelId: number,
    @Body() body: { ownerId: number; targetId: number },
  ) {
    return this.channel_service.opUser(body.ownerId, body.targetId, channelId);
  }

  @Delete('/:channel_id/op')
  deopUser(
    @Param('channel_id') channelId: number,
    @Body() body: { ownerId: number; targetId: number },
  ) {
    return this.channel_service.deopUser(body.ownerId, body.targetId, channelId);
  }
}