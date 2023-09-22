import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';

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