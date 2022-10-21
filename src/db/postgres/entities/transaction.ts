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
    type: 'numeric',
    name: 'amount',
    nullable: false,
  })
  amount!: number;

  @Column('character varying', {
    name: 'amount_currency',
    nullable: false,
    length: 10,
  })
  amountCurrency!: string;

  @Column({
    type: 'numeric',
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
    nullable: false,
  })
  countryId!: number;

  @Column("integer", {
    name: 'providerId',
    nullable: false,
  })
  providerId!: number;

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
