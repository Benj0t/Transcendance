import { Controller, Get, Query, Res, Param, NotFoundException, HttpStatus, UseGuards, Delete, Post, Body, BadRequestException, Patch, InternalServerErrorException, Req } from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { Response, query } from 'express';
import { UserEntity } from './entities/user.entity';
import { UserService } from './entities/user.service';
import * as imageToBase64 from 'image-to-base64';
import { AuthService, JwtPayload } from './auth/auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UserHasFriendEntity } from './entities/user_has_friend.entity';
import { MatchEntity } from './entities/match.entity';
import { UserHasBlockedUserEntity } from './entities/user_has_blocked_user.entity';
import { ChannelService } from './entities/channel.service';
import { channel } from 'diagnostics_channel';
import { ChannelHasMessageEntity } from './entities/channel_has_message.entity';
import { AuthGuard } from '@nestjs/passport';
import { stringify } from 'querystring';
import { ChannelHasMemberEntity } from './entities/channel_has_member.entity';
import { ChannelHasBannedUserEntity } from './entities/channel_has_banned_user.entity';
import { jwtConstants } from './jwt.config';
import { JwtSecretRequestType } from '@nestjs/jwt';

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
  
  @UseGuards(JwtAuthGuard)
  @Get('valid-jwt/')
  validJWT(): { message: string } {
    return ({ message: "valid jwt"});
  }

  /**
   * @returns   The users
   * 
   * @author Komqdo
   */
  
  @UseGuards(JwtAuthGuard)
  @Get('user/')
  getUser(): Promise<UserEntity[] | { message: string }> {
    return this.user_service.findAll().catch(error => {
      console.error("Error fetching users: ", error);
      return { message: 'No user in database.' };
    });
  }

    /**
   * @returns   The user's id
   * 
   */

  @UseGuards(JwtAuthGuard)
  @Get('user/me')
  async getUserMe(@Req() {jwtPayload}: {jwtPayload: JwtPayload}): Promise<UserEntity | { message: string }> {
    const user = await this.user_service.findOne(jwtPayload.sub);
    if (!user) {
      throw new NotFoundException(`User with id ${jwtPayload.sub} not found.`);
    }
    return user;
  }

  /**
   * @param id  The user id.
   * 
   * @returns   The user or the specified id.
   * 
   * @author Komqdo 
   */

  /**
   * Get user channels
   * 
   * @param none
   * 
   * @returns The channels of the specified user.
   * 
   * @author Komqdo
   */

  @UseGuards(JwtAuthGuard)
  @Get('user/channels')
  getMyChannels(@Req() {jwtPayload}: {jwtPayload: JwtPayload}) {
    try {
      return this.channel_service.getUserChannels(jwtPayload.sub);
    } catch (error) {
      throw new NotFoundException(`Not found: ` + error);
    }
  }

  /**
   * Get the friend relationships for an user.
   * 
   * @param id  The user id
   * @returns   The friend relationships for the specified user.
   */
  
  @UseGuards(JwtAuthGuard)
  @Get('user/friends')
  async getUserFriends(@Req() {jwtPayload}: {jwtPayload: JwtPayload}): Promise<UserHasFriendEntity[]> {
    try {

      const friends = await this.user_service.getFriends(jwtPayload.sub);

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

  @UseGuards(JwtAuthGuard)
  @Post('user/friends')
  async addFriend(
    @Req() {jwtPayload}: {jwtPayload: JwtPayload},
    @Query('friend_id') friend_id: number
  ): Promise<{ message: string }> {

    try {
      const message = await this.user_service.addFriend(jwtPayload.sub, friend_id);
      return { message };

    } catch (error) {
      throw (`Not found: ` + error);
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

  // @UseGuards(JwtAuthGuard)
  @Get('user/matches')
  async getUserMatches(@Query('id') id: number): Promise<MatchEntity[]> {

    try {

      const matches = await this.user_service.getMatches(id);

      return matches;

    } catch (error) {
      throw new NotFoundException('Error: ' + error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:id')
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

  @UseGuards(JwtAuthGuard)
  @Get('user/avatar')
  async getUserAvatar(@Req() {jwtPayload}: {jwtPayload: JwtPayload}, @Res() res: Response): Promise<void> {
    const user = await this.user_service.findOne(jwtPayload.sub);
    if (!user) {
      throw new NotFoundException(`User with id ${jwtPayload.sub} not found.`);
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

  @UseGuards(JwtAuthGuard)
  @Post('user/avatar')
  async updateUserAvatar(
    @Req() {jwtPayload}: {jwtPayload: JwtPayload},
    @Body('avatar_base64') avatar_base64: string,
    @Res() res: Response,
  ): Promise<void> {

    try {

      const tmp = await this.user_service.updateAvatar(jwtPayload.sub, avatar_base64);

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
   * Update the avatar for a user.
   *
   * @param id The user id.
   * @param avatar_base64 The new avatar in base64 format.
   * @param res The HTTP response.
   * 
   * @author Komqdo
   */

  @UseGuards(JwtAuthGuard)
  @Patch('user/nickname')
  async updateUserName(
    @Req() {jwtPayload}: {jwtPayload: JwtPayload},
    @Body('nickname') nickname: string,
    @Res() res: Response,
  ): Promise<void> {
    
    try {

      const tmp = await this.user_service.updateNickName(jwtPayload.sub, nickname);

      if (!tmp) {
        res.status(HttpStatus.NOT_FOUND).send('User not found.');
        return ;
      }

      res.status(HttpStatus.OK).json(tmp);
      
    } catch (error) {

      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Name update failed.');
      
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

  @UseGuards(JwtAuthGuard)
  @Delete('user/friends')
  async removeFriend(
    @Req() {jwtPayload}: {jwtPayload: JwtPayload},
    @Query('friend_id') friend_id: number,
  ): Promise<{ message: string }> {

    try {
      const message = await this.user_service.removeFriend(jwtPayload.sub, friend_id);
      return { message };

    } catch (error) {
      throw new NotFoundException(`Not found: ` + error);
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

  @UseGuards(JwtAuthGuard)
  @Post('user/matches')
  async addMatch(
    @Req() {jwtPayload}: {jwtPayload: JwtPayload},
    @Body() requestBody: { theopponent: number; winner_id: number; score_user_1: number; score_user_2: number; match_duration: number }
  ): Promise<{ message: string }> {
    try {
      const { theopponent, winner_id, score_user_1, score_user_2, match_duration } = requestBody;
      const message = await this.user_service.addMatch(jwtPayload.sub, theopponent, winner_id, score_user_1, score_user_2, match_duration);
      return { message };

    } catch (error) {
      throw error;
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

  @UseGuards(JwtAuthGuard)
  @Get('user/blockeds')
  async getUserBlockedUsers(@Req() {jwtPayload}: {jwtPayload: JwtPayload}): Promise<UserHasBlockedUserEntity[]> {

    try {

      const blockedUsers = await this.user_service.getBlockeds(jwtPayload.sub);

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

  @UseGuards(JwtAuthGuard)
  @Post('user/blockeds')
  async blockUser(
    @Req() {jwtPayload}: {jwtPayload: JwtPayload},
    @Query('blocked_id') blocked_user_id: number,
  ): Promise<{ message: string }> {

    try {

      const message = await this.user_service.blockUser(jwtPayload.sub, blocked_user_id);
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

  @UseGuards(JwtAuthGuard)
  @Delete('user/blockeds')
  async unblockUser(
    @Req() {jwtPayload}: {jwtPayload: JwtPayload},
    @Query('unblocked_id') unblocked_id: number,
  ): Promise<{ message: string }> {

    try {
      const message = await this.user_service.unblockUser(jwtPayload.sub, unblocked_id);
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

  @UseGuards(JwtAuthGuard)
  @Post('auth/generate')
  async authGenerate(@Req() {jwtPayload}: {jwtPayload: JwtPayload}): Promise<string>
  {
    const user = await this.user_service.findOne(jwtPayload.sub);
    if (!user) {
      throw new NotFoundException(`User with id ${jwtPayload.sub} not found.`);
    }
    const a2fdata = await this.auth_service.generateQR( user.nickname, user.id );
    const a2fsecret = a2fdata.secret;
    const a2fqrcode = a2fdata.qrcode;
    const updatedUser = await this.user_service.updateSecret(jwtPayload.sub, a2fsecret);
    if (!updatedUser) {
      throw new InternalServerErrorException('a2f enable error');
    }
    if (!a2fdata) {
      throw new InternalServerErrorException('a2f enable error');
    }
    return a2fqrcode;
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('auth/verify')
  async authVerify(@Query('OTP') OTP: string): Promise<boolean>
  {
    const user_id = 1; // ID from jwt
    const user = await this.user_service.findOne(user_id);
    if (!user) {
      throw new NotFoundException(`User with id ${user_id} not found.`);
    }
    const ret = await this.auth_service.verifyTwoFactor(OTP, user.two_factor_secret);
    if (ret)
      await this.user_service.enableTwoFactor(user_id);
    return(ret);
  }

  @UseGuards(JwtAuthGuard)
  @Get('auth/enabled')
  async authEnabled(): Promise<boolean> {
    const user_id = 1; // ID from jwt
    const user = await this.user_service.findOne(user_id);
    if (!user) {
      throw new NotFoundException(`User with id ${user_id} not found.`);
    }
    return(user.two_factor_enable);
  }

  @Get('auth/callback')
  async authCallback(@Query('code') code: string, @Res() res: Response): Promise<void> {

    /**
     * Client id and secret
     */

    const client_id = 'u-s4t2ud-19e5bce000defc36a67ba010b01a62700de81e7f46c1611ccde06b4057bca6d5';
    const client_secret = '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';


    const client_username = 'bonjour';

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

    const twoFactor = {
      client_id: client_id,
      client_username: client_username,
      client_secret: '',
      code: '',
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

      // TODO if twoFactorEnable is true navigate(/AuthTwoFactor)

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

  @UseGuards(JwtAuthGuard)
  @Get('channels/:channel_id/members')
  getMembers(@Param('channel_id') channelId: number): Promise<ChannelHasMemberEntity[]> {
    console.log('Je suis bien la ');
    try {
      console.log(channelId);
      return this.channel_service.getMembers(channelId);
    } catch (error) {
      throw new NotFoundException(`Not found: ` + error);
    }
  }


  /**
   * Get the messages of a channel
   * 
   * @param channel_id The id of the channel. 
   * 
   * @returns The messages of this channel.
   * 
   * @author Komqdo
   */
  @UseGuards(JwtAuthGuard)
  @Get('channels/:channel_id/messages')
  getMessages(@Param('channel_id') channelId: number): Promise<ChannelHasMessageEntity[]> {
    console.log('hehe');
    try {
      console.log(channelId);
      return this.channel_service.getMessages(channelId);
    } catch (error) {
      throw new NotFoundException(`Not found: ` + error);
    }
  }

  /**
   * Create a channel between many users.
   * 
   * @param body 
   * @returns The feedback message.
   * 
   * @author Komqdo
   */
  @UseGuards(JwtAuthGuard)
  @Post('channels/')
  createChannel(@Body() requestBody: { title: string; password: string; members: number[] }) {
    try {
      const { title, password, members } = requestBody;
      return this.channel_service.createChannel(requestBody.title, requestBody.members, requestBody.password);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * Delete a channel.
   * 
   * @param channel_id 
   * 
   * @returns The feedback message.
   * 
   * @author Komqdo
   */
  @UseGuards(JwtAuthGuard)
  @Delete('channels/:channel_id')
  deleteChannel(@Param('channel_id') channel_id: number) {
    try {
      return this.channel_service.deleteChannel(channel_id);
    } catch (error) {
      throw new NotFoundException(`Not found: ` + error);
    }
  }

  /**
   * Get a channel
   * 
   * @param channel_id The id of the channel. 
   * 
   * @returns The channel.
   * 
   * @author Komqdo
   */
  @UseGuards(JwtAuthGuard)
  @Get('channels/:channel_id')
  getChannel(@Param('channel_id') channel_id: number) {
    return this.channel_service.findOne(channel_id);
  }

  /**
   * Update a channel. (Title, password, ...)
   * 
   * @param channel_id The channel id
   * @param body The data to update
   * 
   * @author Komqdo
   */
  @UseGuards(JwtAuthGuard)
  @Patch('channels/:channel_id')
  updateChannel(@Param('channel_id') channel_id: number, @Body() body: any) {
    //TODO
  }

  /**
   * Get the members of a channel
   * 
   * @param channel_id The id of the channel. 
   * 
   * @returns The members of this channel.
   * 
   * @author Komqdo
   */

  /**
   * Get the banned users of a channel
   * 
   * @param channel_id The id of the channel. 
   * 
   * @returns The banned users of this channel.
   * 
   * @author Komqdo
   */
  @UseGuards(JwtAuthGuard)
  @Get('channels/:channel_id/banneds')
  getBanneds(@Param('channel_id') channelId: number): Promise<ChannelHasBannedUserEntity[]> {
    try {
      return this.channel_service.getBanneds(channelId);
    } catch (error) {
      throw new NotFoundException(`Not found: ` + error);
    }
  }

  /**
   * Push a message to a channel.
   * 
   * @param channel_id The channel id.
   * @param body The data about the message.
   * 
   * @returns The feedback message.
   * 
   * @author Komqdo
   */
  @UseGuards(JwtAuthGuard)
  @Post('channels/:channel_id/messages')
  sendMessage(
    @Req() {jwtPayload}: {jwtPayload: JwtPayload},
    @Param('channel_id') channel_id: number,
    @Body() body: {message: string },
  ) {
    try {
      return this.channel_service.sendMessage(jwtPayload.sub, channel_id, body.message);
    } catch (error) {
      throw new NotFoundException(`Not found: ` + error);
    }
  }

  /**
   * Push a direct message to a private channel (DM).
   * 
   * @param body The data about the message.
   * 
   * @returns The feedback message.
   * 
   * @author Komqdo
   */
  @UseGuards(JwtAuthGuard)
  @Post('channels/dm')
  sendDM(
    @Req() {jwtPayload}: {jwtPayload: JwtPayload},
    @Body() body: { recipient_id: number, message: string },
  ) {
    try {
      return this.channel_service.sendDM(jwtPayload.sub, body.recipient_id, body.message);
    } catch (error) {
      throw new NotFoundException(`Not found: ` + error);
    }
  }

  /**
   * Join a channel
   * 
   * @param body The data about joining the channel.
   * 
   * @returns The feedback message.
   * 
   * @author Komqdo
   */
  @UseGuards(JwtAuthGuard)
  @Post('channels/:channel_id/join')
  joinChannel(@Param('channel_id') channel_id: number,
    @Req() {jwtPayload}: {jwtPayload: JwtPayload},
    @Body() body: { password: string }
  ) {
    try {
      return this.channel_service.joinChannel(jwtPayload.sub, channel_id, body.password);
    } catch (error) {
      throw new NotFoundException(`Not found: ` + error);
    }
  }

  /**
   * Leave a channel
   * 
   * @param body The data about leaving the channel.
   * 
   * @returns The feedback message.
   * 
   * @author Komqdo
   */
  @UseGuards(JwtAuthGuard)
  @Post('channels/:channel_id/leave')
  quitChannel(@Param('channel_id') channel_id: number,
    @Req() {jwtPayload}: {jwtPayload: JwtPayload}
  ) {
    try {
      return this.channel_service.leaveChannel(jwtPayload.sub, channel_id);
    } catch (error) {
      throw new NotFoundException(`Not found: ` + error);
    }
  }

  /**
   * Mute an user.
   * 
   * @param channel_id 
   * @param body The data about the mute.
   * 
   * @returns The feedback message.
   * 
   * @author Komqdo
   */
  @UseGuards(JwtAuthGuard)
  @Post('channels/:channel_id/mute')
  muteUser(
    @Param('channel_id') channel_id: number,
    @Body() body: { moderatorId: number; targetId: number; muteTime: string },
  ) {
    try {
      return this.channel_service.muteUser(body.moderatorId, body.targetId, channel_id, body.muteTime);
    } catch (error) {
      throw new NotFoundException(`Not found: ` + error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('channels/:channel_id/mute')
  unmuteUser(
    @Param('channel_id') channelId: number,
    @Body() body: { moderatorId: number; targetId: number },
  ) {
    try {
      return this.channel_service.unmuteUser(body.moderatorId, body.targetId, channelId);
    } catch (error) {
      throw new NotFoundException(`Not found: ` + error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('channels/:channel_id/kick')
  kickUser(
    @Param('channel_id') channelId: number,
    @Body() body: { moderatorId: number; targetId: number },
  ) {
    try {
      return this.channel_service.kickUser(body.moderatorId, body.targetId, channelId);
    } catch (error) {
      throw new NotFoundException(`Not found: ` + error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('channels/:channel_id/ban')
  banUser(
    @Param('channel_id') channelId: number,
    @Body() body: { moderatorId: number; targetId: number; banTime: string },
  ) {
    try {
      return this.channel_service.banUser(body.moderatorId, body.targetId, channelId, body.banTime);
    } catch (error) {
      throw new NotFoundException(`Not found: ` + error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('channels/:channel_id/ban')
  pardonUser(
    @Param('channel_id') channelId: number,
    @Body() body: { moderatorId: number; targetId: number },
  ) {
    try {
      return this.channel_service.pardonUser(body.moderatorId, body.targetId, channelId);
    } catch (error) {
      throw new NotFoundException(`Not found: ` + error);
    }
  }
  
  @UseGuards(JwtAuthGuard)
  @Post('channels/:channel_id/op')
  opUser(
    @Param('channel_id') channelId: number,
    @Body() body: { ownerId: number; targetId: number },
  ) {
    try {
      return this.channel_service.opUser(body.ownerId, body.targetId, channelId);
    } catch (error) {
      throw new NotFoundException(`Not found: ` + error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('channels/:channel_id/op')
  deopUser(
    @Param('channel_id') channelId: number,
    @Body() body: { ownerId: number; targetId: number },
  ) {
    try {
      return this.channel_service.deopUser(body.ownerId, body.targetId, channelId);
    } catch (error) {
      throw new NotFoundException(`Not found: ` + error);
    }
  }
}