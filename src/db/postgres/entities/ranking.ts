import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm';
import { Country } from './country';
import { Provider } from './provider';

@Entity()
export class Ranking {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('character varying', {
    name: 'year',
    nullable: false,
    length: 5,
  })
  year!: string;

  @Column({
    type: 'numeric',
    name: 'amount_in_usd',
    nullable: false,
  })
  amountInUsd!: number;

  @Column("integer", {
    name: 'countryId',
    nullable: false,
  })
  countryId!: number;

  @Column("integer", {
    name: 'providerId',
    nullable: false,
  })
  providerId!: number;

  @ManyToOne(() => Country, (country: Country) => country.rankings)
  country?: Country;

  @ManyToOne(() => Provider, (provider: Provider) => provider.rankings)
  provider?: Provider;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
