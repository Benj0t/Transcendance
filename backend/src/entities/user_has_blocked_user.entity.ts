import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('v_user_has_blocked_user')
export class UserHasBlockedUserEntity {
  @PrimaryGeneratedColumn()
  id: number;
}
