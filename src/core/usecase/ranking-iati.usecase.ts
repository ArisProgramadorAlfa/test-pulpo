import { Country, Ranking, Transaction } from "@database/postgres";
import moment from "moment";
import { CountryCrud, RankingCrud, TransactionCrud } from "../crud";
import { IATIImpl } from "../implements";
import { IIATIBnd, IIATIDoc, IRankingResponse, ITransactionsIATIResponse } from "../interfaces";
import { IATISrvices } from "../services";
import { Logger } from "../utils";

class RankingIATIUsecase {
  private readonly iatiBnd: IIATIBnd;
  private readonly iatiSrvices: IATISrvices;
  private readonly countryCrud: CountryCrud;
  private readonly rankingCrud: RankingCrud;
  private readonly transactionCrud: TransactionCrud;
  private readonly loggerLocal: Logger;

  constructor() {
    this.iatiBnd = new IATIImpl();
    this.iatiSrvices = new IATISrvices();
    this.countryCrud = new CountryCrud();
    this.rankingCrud = new RankingCrud();
    this.transactionCrud = new TransactionCrud();
    this.loggerLocal = new Logger(
      'ranking-use-case',
      'ranking-iati.usecase.ts'
    )

  }

  async getRankingByCountryCode(
    countryCode: string,
    limitYears: number = 5,
    loggerSource?: Logger
  ): Promise<IRankingResponse> {
    const logger: Logger = loggerSource || this.loggerLocal;
    try {
      const currentsListTofound: number[] = this.iatiBnd.getArrayOfLastYears(limitYears);
      logger?.info({
        logKey: 'getRankingByCountryCode',
        data: { currentsListTofound }
      });
      const country: Country = await this.iatiBnd.getCountry(
        this.countryCrud,
        countryCode
      );
      logger?.info({
        logKey: 'getRankingByCountryCode',
        data: { country }
      });
      if (!country) {
        logger?.warning({
          logKey: 'getRankingByCountryCode',
          message: `Country ${countryCode} not found.`
        });
        throw new Error('Country code not found');
      }
      const ranking: IRankingResponse = await this.iatiBnd.getRankingFormatted(
        currentsListTofound,
        this.rankingCrud,
        country.id,
        undefined,
        logger,
      );

      return ranking;
    } catch (error) {
      logger?.error({
        logKey: 'getRankingByCountryCode',
        error
      });
      throw error;
    }
  }

  async createRanking(
    countryCode: string,
    limitYear: number = 5,
    loggerSource?: Logger
  ): Promise<IRankingResponse> {
    const logger: Logger = loggerSource || this.loggerLocal;
    try {
      const transactionsRequestList: ITransactionsIATIResponse[] = await this.iatiBnd
        .getRequestsOfTransactions(
          countryCode,
          this.iatiSrvices,
          logger
        );

      const { transactionsTosave, ranking}: {
        transactionsTosave: Partial<Transaction>[],
        ranking: IRankingResponse
      } = await this.iatiBnd.buildRankingWithIatiRequests(
        transactionsRequestList,
        countryCode,
        limitYear,
        logger
      )
      logger?.debug({
        logKey: 'createRanking',
        data: {
          ranking,
          transactionsTosave
        }
      });

      await this.iatiBnd.saveRankingAndTransactions(
        ranking,
        transactionsTosave,
        countryCode,
        this.rankingCrud,
        this.transactionCrud,
        logger
      )

      return this.iatiBnd.orderedRanking(ranking);
    } catch (error) {
      logger?.error({
        logKey: 'createRanking',
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
    } catch (error) {
      logger?.error({
        logKey: 'updateRanking',
        error
      });
      throw error;
    }
  }
}

export { RankingIATIUsecase };
