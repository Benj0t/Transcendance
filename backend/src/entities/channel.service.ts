import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChannelEntity } from './channel.entity';
import { ChannelHasMemberEntity } from './channel_has_member.entity';
import { ChannelHasMessageEntity } from './channel_has_message.entity';
import { ChannelHasBannedUserEntity } from './channel_has_banned_user.entity';

@Injectable()
export class ChannelService {

	constructor(
		@InjectRepository(ChannelEntity)
		private channelRepository: Repository<ChannelEntity>
	) { }

	async createChannel(title: string, password: string, members: number[]): Promise<string> {
		try {
			const result = await this.channelRepository.query(
				`select create_channel($1, $2, $3)`,
				[title, password, members]
			);
			return result[0].create_channel;
		} catch (error) {
			throw error;
		}
	}

	async getUserChannels(userId: number): Promise<string> {
		try {
			const result = await this.channelRepository.query(
				`select get_user_channels($1)`,
				[userId]
			);
			return result[0].get_all_user_channels;
		} catch (error) {
			throw error;
		}
	}

	// Pour GET /api/channels/{channel_id}/messages
	async getMessages(channelId: number): Promise<string> {
		try {
			const result = await this.channelRepository.query(
				`select get_messages($1)`,
				[channelId]
			);
			return result[0].get_messages;
		} catch (error) {
			throw error;
		}
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

	// POST /api/channels/{channel_id}/messages
	async sendMessage(userId: number, channelId: number, message: string): Promise<string> {
		const result = await this.channelRepository.query(`select send_message(${userId}, ${channelId}, ${message})`);
		return result[0].send_message;
	}

	// POST /api/channels/{channel_id}/mute
	async muteUser(moderatorId: number, targetId: number, channelId: number, muteTime: string): Promise<string> {
		const result = await this.channelRepository.query(`select mute_user(${moderatorId}, ${targetId}, ${channelId}, ${muteTime})`);
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
		const result = await this.channelRepository.query(`select ban_user(${moderatorId}, ${targetId}, ${channelId}, ${banTime})`);
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
