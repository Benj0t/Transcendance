import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('v_user_has_blocked_user')
export class UserHasBlockedUserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.blockedUsers)
  user: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.blockedBy)
  blockedUser: UserEntity;
}
