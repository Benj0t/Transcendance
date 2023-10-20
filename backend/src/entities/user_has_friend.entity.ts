import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('v_user_has_friend')
export class UserHasFriendEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.friends)
  user: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.friends)
  friend: UserEntity;
}
