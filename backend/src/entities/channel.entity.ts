import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ChannelHasMemberEntity } from './channel_has_member.entity';
import { ChannelHasMessageEntity } from './channel_has_message.entity';
import { ChannelHasBannedUserEntity } from './channel_has_banned_user.entity';

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

	@OneToMany(() => ChannelHasMemberEntity, (channelHasMember) => channelHasMember.channel)
	members: ChannelHasMemberEntity[];

	@OneToMany(() => ChannelHasMessageEntity, (channelHasMessage) => channelHasMessage.channel)
	messages: ChannelHasMessageEntity[];

	@OneToMany(() => ChannelHasBannedUserEntity, (channelHasBannedUser) => channelHasBannedUser.channel)
	bannedUsers: ChannelHasBannedUserEntity[];
}
