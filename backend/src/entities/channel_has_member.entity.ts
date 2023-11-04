import { Entity, Column, PrimaryColumn, ManyToOne } from 'typeorm';
import { ChannelEntity } from './channel.entity';

@Entity({ name: 'channel_has_member' })
export class ChannelHasMemberEntity {
  @PrimaryColumn()
  channel_id: number;

  @PrimaryColumn()
  user_id: number;

  @Column()
  role: number;

  @Column({ type: 'timestamp with time zone', nullable: true })
  mute_expiry_at?: Date;
}
