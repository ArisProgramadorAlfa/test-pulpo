import { Provider } from "@database/postgres";
import { FindManyOptions,  Repository } from "typeorm";

class ProviderCrud {

  private readonly providerRepository: Repository<Provider>;

  constructor() {
    this.providerRepository =  (global as any).dbSource.getRepository(Provider);
  }

  async createMany(
    data: Omit<Partial<Provider>, 'id'>[]
  ): Promise<Provider[]> {
    return await this.providerRepository.save(data);
  }

  async getManyProvider (
    where?: Partial<Provider>[],
    select?: (keyof Partial<Provider>)[],
    relations?: string[],
    order?: { [keyof: string]: 'DESC' | 'ASC' } | null,
    take?: number | null
  ): Promise<Provider[]> {
    const findOptions: FindManyOptions<Provider> = {};
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
    const providersFound: Provider[] = await this.providerRepository.find(findOptions);
    return providersFound;
  }

  async updateOne(
    dataToFind: Partial<Provider>,
    dataToUpdate: Omit<Partial<Provider>, 'id'>,
  ): Promise<Provider | null> {
    const providerToUpdate: Provider = await this.providerRepository.findOneBy({
      ...dataToFind,
    }) as Provider;
    if(providerToUpdate) {
      Object.assign(providerToUpdate, { ...dataToUpdate });
      return await this.providerRepository.save(providerToUpdate);
    }
    return null;
  }

}

export { ProviderCrud };
