import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { MatchEntity } from './match.entity';
import { UserHasFriendEntity } from './user_has_friend.entity';
import { UserHasBlockedUserEntity } from './user_has_blocked_user.entity';

@Injectable()
export class UserService {

	constructor(
		@InjectRepository(UserEntity)
		private usersRepository: Repository<UserEntity>,
	) { }

	findAll(): Promise<UserEntity[]> {
		return this.usersRepository.find();
	}

	findOne(id: number): Promise<UserEntity> {
		return this.usersRepository.findOne({ where: { id: id } });
	}

	async getFriends(id: number): Promise<UserHasFriendEntity[]> {
		
		const friends = await this.usersRepository.query(
			`select * from get_user_friendships($1)`,
			[id]
		);
		
		return friends;
	}

	async getMatches(id: number): Promise<MatchEntity[]> {

		const matches = await this.usersRepository.query(
			`select * from get_user_matches($1)`,
			[id]
		);

		return matches;
	}

	async getBlockeds(id: number): Promise<UserHasBlockedUserEntity[]> {
		
		const friends = await this.usersRepository.query(
			`select * from get_user_blocked_users($1)`,
			[id]
		);
		return friends;
	}

	async upsertUser(user42_id: number, nickname: string, avatar_base64: string): Promise<UserEntity | null> {
		const result = await this.usersRepository.query(
			`select * from upsert_user($1, $2, $3)`,
			[user42_id, nickname, avatar_base64]
		);

		if (result && result.length > 0) {
			return result[0];
		}

		return null;
	}

	async updateAvatar(user_id: number, avatar_base64: string): Promise<UserEntity | null> {
		
		try {

		  const user = await this.findOne(user_id);
	
		  if (!user) {
			return null;
		  }
	
		  user.avatar_base64 = avatar_base64;
	
		  await this.usersRepository.save(user);
	
		  return user;
		} catch (error) {
		  throw error;
		}
	}

	async updateNickName(user_id: number, nickname: string): Promise<UserEntity | null> {
		
		try {

			const user = await this.findOne(user_id);
	  
			if (!user) {
			  return null;
			}
	  
			user.nickname = nickname;
	  
			await this.usersRepository.save(user);
	  
			return user;
		  } catch (error) {
			throw error;
		  }
	}

	async updateSecret(user_id: number, user_secret: string): Promise<UserEntity | null> {
		
		try {

		  const user = await this.findOne(user_id);
	
		  if (!user) {
			return null;
		  }
	
		  user.two_factor_secret = user_secret;
	
		  await this.usersRepository.save(user);
	
		  return user;
		} catch (error) {
		  throw error;
		}
	}

	async enableTwoFactor(user_id: number): Promise<UserEntity | null> {
		
		try {

		  const user = await this.findOne(user_id);
	
		  if (!user) {
			return null;
		  }
	
		  user.two_factor_enable = true;
	
		  await this.usersRepository.save(user);
	
		  return user;
		} catch (error) {
		  throw error;
		}
	}

	async addFriend(user_id: number, friend_id: number): Promise<string> {

		if (!friend_id) {
			throw new BadRequestException("Missing required parameter.");
		}

		try {
			if (friend_id == 0)
				return 'This user does not exist';
			const result = await this.usersRepository.query(
				`select add_user_friend($1, $2)`,
				[user_id, friend_id]
			);

			return result[0];
		} catch (error) {
		  throw error;
		}
	}
	
	async removeFriend(user_id: number, friend_id: number): Promise<string> {
		
		if (!friend_id) {
			throw new BadRequestException("Missing required parameter.");
		}

		try {
		  const result = await this.usersRepository.query(
			`select remove_user_friend($1, $2)`,
			[user_id, friend_id]
		  );

		  return result[0];

		} catch (error) {
		  throw error;
		}
	}

	async addMatch(user_id: number, opponent_id: number, winner_id: number, score_user_1: number, score_user_2: number, match_duration: number): Promise<string> {
		
		if (!opponent_id || !winner_id) {
			throw new BadRequestException("Missing required parameter.");
		}

		try {

		  const result = await this.usersRepository.query(
			`select add_match($1, $2, $3, $4, $5, $6)`,
			[user_id, opponent_id, winner_id, score_user_1, score_user_2, match_duration]
		  );

		  return result[0].add_match;

		} catch (error) {
		  throw error;
		}
	}

	async blockUser(userId: number, blocked_user_id: number): Promise<string> {
		
		if (!blocked_user_id) {
			throw new BadRequestException("Missing required parameter.");
		}

		try {
		  const result = await this.usersRepository.query(
			`select block_user($1, $2)`,
			[userId, blocked_user_id]
		  );

		  return result[0];

		} catch (error) {
		  throw error;
		}
	}
	
	async unblockUser(user_id: number, unblocked_user_id: number): Promise<string> {
		
		if (!unblocked_user_id) {
			throw new BadRequestException("Missing required parameter.");
		}

		try {
		  const result = await this.usersRepository.query(
			`select unblock_user($1, $2)`,
			[user_id, unblocked_user_id]
		  );

		  return result[0];

		} catch (error) {
		  throw error;
		}
	}
}