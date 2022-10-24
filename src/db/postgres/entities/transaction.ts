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
export class Transaction {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'bigint',
    name: 'amount',
    nullable: true,
  })
  amount!: number;

  @Column('character varying', {
    name: 'amount_currency',
    nullable: true,
    length: 10,
  })
  amountCurrency!: string;

  @Column({
    type: 'bigint',
    name: 'amount_in_usd',
    nullable: false,
  })
  amountInUsd!: number; 

  @Column('character varying', {
    name: 'year',
    nullable: false,
    length: 5,
  })
  year!: string;

  @Column('character varying', {
    name: 'iati_id',
    nullable: true,
    length: 100,
  })
  iatiId!: string;

  @Column("integer", {
    name: 'recipientCountryId',
    nullable: true,
  })
  countryId!: number;

  @Column("integer", {
    name: 'providerId',
    nullable: true,
  })
  providerId!: number;

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

  @ManyToOne(() => Country, (country: Country) => country.rankings)
  recipientCountry?: Country;

  @ManyToOne(() => Provider, (provider: Provider) => provider.rankings)
  provider?: Provider;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
