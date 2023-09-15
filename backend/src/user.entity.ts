import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'user' }) 
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  nickname: string;

  @Column({ default: 'default_avatar.png' })
  avatar_url: string;

  @Column({ default: false })
  two_factor_auth: boolean;

  @Column({ name: 'user_42_id', unique: true })
  user42_id: number; 
}