import { Ranking } from "@database/postgres";
import { FindManyOptions,  Repository } from "typeorm";

class RankingCrud {

  private readonly rankingRepository: Repository<Ranking>;

  constructor() {
    this.rankingRepository =  (global as any).dbSource.getRepository(Ranking);
  }

  async createMany(
    data: Omit<Partial<Ranking>, 'id'>[]
  ): Promise<Ranking[]> {
    return await this.rankingRepository.save(data);
  }

  async getMany (
    where?: Partial<Ranking>[],
    select?: (keyof Partial<Ranking>)[],
    relations?: string[],
    order?: { [keyof: string]: 'DESC' | 'ASC' } | null,
    take?: number | null
  ): Promise<Ranking[]> {
    const findOptions: FindManyOptions<Ranking> = {};
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
    const RankingsFound: Ranking[] = await this.rankingRepository.find(findOptions);
    return RankingsFound;
  }

  async updateOne(
    dataToFind: Partial<Ranking>,
    dataToUpdate: Omit<Partial<Ranking>, 'id'>,
  ): Promise<Ranking | null> {
    const rankingToUpdate: Ranking = await this.rankingRepository.findOneBy({
      ...dataToFind,
    }) as Ranking;
    if(rankingToUpdate) {
      Object.assign(rankingToUpdate, { ...dataToUpdate });
      return await this.rankingRepository.save(rankingToUpdate);
    }
    return null;
  }

}

export { RankingCrud };
