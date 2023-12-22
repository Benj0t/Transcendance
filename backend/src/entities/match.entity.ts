import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity'; 

@Entity({ name: 'match' })
export class MatchEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user: number;

  @Column()
  opponent: number;

  @Column()
  winner: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

}
