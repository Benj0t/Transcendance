import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'rank' })
export class RankEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'rank_name' })
  rankName: string;
}
