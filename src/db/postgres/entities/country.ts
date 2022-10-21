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
export class Country {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('character varying', {
    name: 'code',
    nullable: false,
    length: 6,
    unique: true,
  })
  code!: string;

  @Column('character varying', {
    name: 'name',
    length: 50,
    nullable: false,
    unique: true,
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
