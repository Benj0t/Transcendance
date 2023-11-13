import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'channel' })
export class ChannelEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	title: string;

	@Column({ default: false })
	is_private: boolean;

	@Column({ nullable: true })
	password?: string;

	@Column()
	owner_id: number;
}
