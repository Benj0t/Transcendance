import { Entity, Column, PrimaryColumn, ManyToOne } from 'typeorm';
import { ChannelEntity } from './channel.entity';

@Entity({ name: 'channel_has_message' })
export class ChannelHasMessageEntity {
  @PrimaryColumn()
  channel_id: number;

  @PrimaryColumn()
  user_id: number;

  @Column()
  message: string;

  @Column({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToOne(() => ChannelEntity, (channel) => channel.messages)
  channel: ChannelEntity;
}
