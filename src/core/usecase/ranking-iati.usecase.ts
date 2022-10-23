import { Country } from "@database/postgres";
import moment from "moment";
import { CountryCrud, RankingCrud} from "../crud";
import { IATIImpl } from "../implements";
import { IIATIBnd, IRankingResponse } from "../interfaces";
import { IATISrvices } from "../services";
import { Logger } from "../utils";

class RankingIATIUsecase {
  private readonly iatiBnd: IIATIBnd;
  private readonly iatiSrvices: IATISrvices;
  private readonly countryCrud: CountryCrud;
  private readonly rankingCrud: RankingCrud;

  constructor() {
    this.iatiBnd = new IATIImpl();
    this.iatiSrvices = new IATISrvices();
    this.countryCrud = new CountryCrud();
    this.rankingCrud = new RankingCrud();
  }

  async getRankingByCountryCode(
    countryCode: string,
    logger?: Logger
  ): Promise<any> {
    const yearsToFound: number = 5;
    const currentYear: number = moment().year();
    const currentsListTofound: number[] = [currentYear];
    for (let i = 1; i < yearsToFound; i++) {
      const lastYear: number = currentsListTofound[currentsListTofound.length - 1];
      currentsListTofound.push(lastYear - 1);
    }
    logger?.info({
      logKey: 'getRankingByCountryCode',
      data: { currentsListTofound }
    });
    try {
      const country: Country = await this.iatiBnd.getCountry(
        this.countryCrud,
        countryCode
      );
      logger?.info({
        logKey: 'getRankingByCountryCode',
        data: { country }
      });
      const ranking: IRankingResponse = await this.iatiBnd.getRankingFormatted(
        currentsListTofound,
        this.rankingCrud,
        country.id,
        undefined,
        logger,
      );
      logger?.info({
        logKey: 'getRankingByCountryCode',
        data: { ranking }
      });
      return ranking;
    } catch (error) {
      logger?.error({
        logKey: 'getRankingByCountryCode',
        error
      });
      throw error;
    }
  }

  async updateRanking(
    countryCode: string,
    logger?: Logger
  ): Promise<IRankingResponse> {
    try {
      const rows = 10;
      const start = 0;
      const transactionsByCountryCode = await this.iatiBnd.getTransactionsByCountryCode(
        countryCode,
        rows,
        start,
        this.iatiSrvices,
        logger
      );
      logger?.debug({
        logKey: 'getRankingByCountryCode',
        data: { transactionsByCountryCode }
      });
      return transactionsByCountryCode;
    } catch(error) {
      logger?.error({
        logKey: 'updateRanking',
        error
      });
      throw error;
    }
  }
}

export { RankingIATIUsecase };
