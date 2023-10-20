import { Injectable } from '@nestjs/common';
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
			`select * from get_user_friends($1)`,
			[id]
		);
		
		return friends;
	}

	async getMatches(id: number): Promise<MatchEntity[]> {

		const matches = await this.usersRepository.query(
			`select * from get_user_matches($1)`,
			[id]
		);

		return (matches);
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
}