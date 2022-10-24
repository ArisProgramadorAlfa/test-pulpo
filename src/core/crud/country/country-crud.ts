import { Country } from "@database/postgres";
import { FindManyOptions, FindOneOptions, Repository } from "typeorm";

class CountryCrud {

  private readonly countryRepository: Repository<Country>;

  constructor() {
    this.countryRepository =  (global as any).dbSource.getRepository(Country);
  }

  async createMany(data: Omit<Partial<Country>, 'id'>[]): Promise<Country[]> {
    return await this.countryRepository.save(data);
  }

  async getMany (
    where?: Partial<Country>[],
    select?: (keyof Partial<Country>)[],
    relations?: string[],
    order?: { [keyof: string]: 'DESC' | 'ASC' } | null,
    take?: number | null
  ): Promise<Country[]> {
    const findOptions: FindManyOptions<Country> = {};
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
    const countriesFound: Country[] = await this.countryRepository.find(findOptions);
    return countriesFound;
  }

  async findOrCreate(
    data: Omit<Partial<Country>, 'id'>
  ): Promise<Country> {
    const findOptions: FindOneOptions<Country> = {};
    findOptions.where = data;
    let countryFound: Country | null = await this.countryRepository.findOne(findOptions);
    if (!countryFound) {
      [countryFound] = await this.createMany([data]);
    }
    return countryFound;
  }

}

export { CountryCrud };
