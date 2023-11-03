import { Entity, Column, PrimaryColumn, ManyToOne } from 'typeorm';
import { ChannelEntity } from './channel.entity';

@Entity({ name: 'channel_has_banned_user' })
export class ChannelHasBannedUserEntity {
  @PrimaryColumn()
  channel_id: number;

  @PrimaryColumn()
  user_id: number;

  @Column({ type: 'timestamp with time zone', nullable: true })
  expiry_at?: Date;

  @ManyToOne(() => ChannelEntity, (channel) => channel.bannedUsers)
  channel: ChannelEntity;
}
