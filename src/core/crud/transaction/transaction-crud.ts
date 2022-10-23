import { Transaction } from "@database/postgres";
import { FindManyOptions, Repository } from "typeorm";

class TransactionCrud {

  private readonly transactionRepository: Repository<Transaction>;

  constructor() {
    this.transactionRepository =  (global as any).dbSource.getRepository(Transaction);
  }

  async createMany(data: Omit<Partial<Transaction>, 'id'>[]): Promise<Transaction[]> {
    return await this.transactionRepository.save(data);
  }

  async getMany (
    where?: Partial<Transaction>[],
    select?: (keyof Partial<Transaction>)[],
    relations?: string[],
    order?: { [keyof: string]: 'DESC' | 'ASC' } | null,
    take?: number | null
  ): Promise<Transaction[]> {
    const transactionRepository: Repository<Transaction> =
      (global as any).dbSource.getRepository(Transaction);
    const findOptions: FindManyOptions<Transaction> = {};
    if(where) {
      findOptions.where = where
    }
    if(select) {
      findOptions.select = select;
    }
    if(relations) {
      findOptions.relations = relations;
    }
    if(order) {
      findOptions.order = order
    }    
    if(take) {
      findOptions.take = take;
    }
    const countriesFound: Transaction[] = await transactionRepository.find(findOptions);
    return countriesFound;
  }

}

export { TransactionCrud };
