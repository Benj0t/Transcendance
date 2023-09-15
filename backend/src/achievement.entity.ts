import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'achievement' })
export class AchievementEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('text')
  caption: string;

  @Column({ name: 'icon_url' })
  iconUrl: string;

  
}
