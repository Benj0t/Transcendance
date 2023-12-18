import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { ChannelEntity } from './channel.entity';
import { ChannelHasMessageEntity } from './channel_has_message.entity';
import { ChannelHasMemberEntity } from './channel_has_member.entity';
import { ChannelHasBannedUserEntity } from './channel_has_banned_user.entity';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
@Injectable()
export class ChannelService {

	constructor(
		@InjectRepository(ChannelEntity)
		private channelRepository: Repository<ChannelEntity>
	) { }

	findOne(id: number, options?: FindOneOptions<ChannelEntity>): Promise<ChannelEntity> {
		if (options) {
			return this.channelRepository.findOne({ where: { id: id }, ...options });
		} else {
			return this.channelRepository.findOne({ where: { id: id } });
		}
	}

	async createChannel(title: string, members: number[], password: string): Promise<string> {
		try {
			const result = await this.channelRepository.query(
				`select create_channel($1, $2, $3, $4)`,
				[title, members, false, password]
			);
			return result[0].create_channel;
		} catch (error) {
			throw error;
		}
	}

	async getUserChannels(userId: number): Promise<any[]> {
		try {
			const result = await this.channelRepository.query(
				`SELECT * FROM get_user_channels($1)`,
				[userId]
			);
			return result;
		} catch (error) {
			throw new InternalServerErrorException(error);
		}
	}

	// For GET /api/channels/{channel_id}/messages
	async getMessages(channelId: number): Promise<ChannelHasMessageEntity[]> {
		const messages = await this.channelRepository.query(`
			select * from channel_has_message WHERE channel_id = $1
		`, [channelId]);
		return messages;
	}

	async getMembers(channelId: number): Promise<ChannelHasMemberEntity[]> {
		const members = await this.channelRepository.query(`
			select * from channel_has_member WHERE channel_id = $1
		`, [channelId]);
		return members;
	}

	async getBanneds(channelId: number): Promise<ChannelHasBannedUserEntity[]> {
		const members = await this.channelRepository.query(`
			select * from v_active_channel_has_banned_user WHERE channel_id = $1
		`, [channelId]);
		return members;
	}

	async deleteChannel(channelId: number): Promise<string> {
		try {
			const result = await this.channelRepository.query(
				`select delete_channel($1)`,
				[channelId]
			);
			return result[0].delete_channel;
		} catch (error) {
			throw error;
		}
	}

	async sendDM(userId: number, recipientId: number, message: string): Promise<string> {
		try {
			const result = await this.channelRepository.query(
				`select send_direct_message($1, $2, $3)`,
				[userId, recipientId, message]
			);
			return result[0].send_direct_message;
		} catch (error) {
			throw error;
		}
	}

	async joinChannel(user_id: number, channel_id: number, password: string): Promise<string> {
		try {
			const result = await this.channelRepository.query(
				`select join_channel($1, $2, $3)`,
				[user_id, channel_id, password]
			);
			return result[0].join_channel;
		} catch (error) {
			throw error;
		}
	}
	
	async leaveChannel(user_id: number, channel_id: number): Promise<string> {
		try {
			const result = await this.channelRepository.query(
				`select leave_channel($1, $2)`,
				[user_id, channel_id]
			);
			return result[0].leave_channel;
		} catch (error) {
			throw error;
		}
	}

	// POST /api/channels/{channel_id}/messages
	async sendMessage(userId: number, channelId: number, message: string): Promise<string> {
		const result = await this.channelRepository.query('select send_message($1, $2, $3)', [userId, channelId, message]);
		return result[0].send_message;
	}
	
	// POST /api/channels/{channel_id}/mute
	async muteUser(moderatorId: number, targetId: number, channelId: number, muteTime: string): Promise<string> {
		const result = await this.channelRepository.query(`select mute_user($1, $2, $3, $4)`,
			[moderatorId, targetId, channelId, muteTime]);
		return result[0].mute_user;
	}

	// DELETE /api/channels/{channel_id}/mute
	async unmuteUser(moderatorId: number, targetId: number, channelId: number): Promise<string> {
		try {
			const result = await this.channelRepository.query(
				`select unmute_user($1, $2, $3)`,
				[moderatorId, targetId, channelId]
			);
			return result[0].unmute_user;
		} catch (error) {
			throw error;
		}
	}

	// POST /api/channels/{channel_id}/kick
	async kickUser(moderatorId: number, targetId: number, channelId: number): Promise<string> {
		const result = await this.channelRepository.query(`select kick_user(${moderatorId}, ${targetId}, ${channelId})`);
		return result[0].kick_user;
	}

	// POST /api/channels/{channel_id}/ban
	async banUser(moderatorId: number, targetId: number, channelId: number, banTime: string): Promise<string> {
		const result = await this.channelRepository.query(`select ban_user($1, $2, $3, $4)`,
			[moderatorId, targetId, channelId, banTime]);
		return result[0].ban_user;
	}

	// DELETE /api/channels/{channel_id}/ban
	async pardonUser(moderatorId: number, targetId: number, channelId: number): Promise<string> {
		try {
			const result = await this.channelRepository.query(
				`select pardon_user($1, $2, $3)`,
				[moderatorId, targetId, channelId]
			);
			return result[0].pardon_user;
		} catch (error) {
			throw error;
		}
	}

	// POST /api/channels/{channel_id}/op
	async opUser(ownerId: number, targetId: number, channelId: number): Promise<string> {
		const result = await this.channelRepository.query(`select op_user(${ownerId}, ${targetId}, ${channelId})`);
		return result[0].op_user;
	}

	// DELETE /api/channels/{channel_id}/op
	async deopUser(ownerId: number, targetId: number, channelId: number): Promise<string> {
		const result = await this.channelRepository.query(`select deop_user(${ownerId}, ${targetId}, ${channelId})`);
		return result[0].deop_user;
	}
}
