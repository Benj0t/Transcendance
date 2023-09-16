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

	findAll(): Promise<UserEntity []> {
		return this.usersRepository.find();
	}

	findOne(id: number): Promise<UserEntity> {
		return this.usersRepository.findOne({ where: { id: id } });
	}
}