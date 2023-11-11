import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'channel_has_banned_user' })
export class ChannelHasBannedUserEntity {
  @PrimaryColumn()
  channel_id: number;

  @PrimaryColumn()
  user_id: number;

  @PrimaryColumn()
  ban_id: number;

  @Column({ type: 'timestamp with time zone', nullable: true })
  expiry_at?: Date;
}
