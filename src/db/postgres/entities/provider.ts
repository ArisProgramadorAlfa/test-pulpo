import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { Ranking } from './ranking';

@Entity()
export class Provider {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('character varying', {
    name: 'code',
    nullable: true,
    length: 100,
    unique: true,
  })
  code!: string;

  @Column('character varying', {
    name: 'name',
    length: 150,
    nullable: false,
    unique: true
  })
  name!: string;

  @OneToMany(() => Ranking , (ranking: Ranking)  => ranking.country)
  rankings?: Ranking[];

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
