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
    type: 'bigint',
    name: 'amount_in_usd',
    nullable: false,
  })
  amountInUsd!: number;

  @Column("integer", {
    name: 'countryId',
    nullable: true,
  })
  countryId!: number;

  @Column("integer", {
    name: 'providerId',
    nullable: true,
  })
  providerId!: number;

  @ManyToOne(() => Country, (country: Country) => country.rankings)
  country?: Country;

  @ManyToOne(() => Provider, (provider: Provider) => provider.rankings)
  provider?: Provider;

  @Column("character varying", {
    name: 'country_code',
    nullable: false,
  })
  countryCode!: string;

  @Column("character varying", {
    name: 'provider_name',
    nullable: false,
  })
  providerName!: string;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
