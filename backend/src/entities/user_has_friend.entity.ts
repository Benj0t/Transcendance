import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('user_has_friend')
export class UserHasFriendEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  friendId: number;

  @ManyToOne(() => UserEntity, (user) => user.friends)
  user: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.friends)
  friend: UserEntity;
}
