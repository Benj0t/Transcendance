import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user_has_friend')
export class UserHasFriendEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  friendId: number;
}
