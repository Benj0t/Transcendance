import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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
}