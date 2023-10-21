import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserHasFriendEntity } from './user_has_friend.entity';
import { UserHasBlockedUserEntity } from './user_has_blocked_user.entity';

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  nickname: string;

  @Column()
  avatar_base64: string;

  @Column({ default: false })
  two_factor_auth: boolean;

  @Column({ unique: true })
  user_42_id: number;

  @OneToMany(() => UserHasFriendEntity, (userHasFriend) => userHasFriend.user)
  friends: UserHasFriendEntity[];

  @OneToMany(() => UserHasBlockedUserEntity, (userHasBlockedUser) => userHasBlockedUser.user)
  blockedUsers: UserHasBlockedUserEntity[];

  @OneToMany(() => UserHasBlockedUserEntity, (userHasBlockedUser) => userHasBlockedUser.blockedUser)
  blockedBy: UserHasBlockedUserEntity[];
}
