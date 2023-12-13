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
  // @ManyToOne(() => UserEntity, { eager: true }) 
  // user: UserEntity;

  // @ManyToOne(() => UserEntity, { eager: true })
  // opponent: UserEntity;

  // @ManyToOne(() => UserEntity, { eager: true }) 
  // winner: UserEntity;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

}
