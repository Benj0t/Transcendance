import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'channel_has_message' })
export class ChannelHasMessageEntity {
  @PrimaryColumn({ name: 'channel_id' })
  channel_id: number;

  @PrimaryColumn({ name: 'user_id' })
  user_id: number;

  @Column()
  message: string;

  @Column({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
  created_at: Date;
}
