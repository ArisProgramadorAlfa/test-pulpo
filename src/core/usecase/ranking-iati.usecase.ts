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
      /* #region  array of iati transactions request */
      let rows = 10000;
      let start = 0;
      const transactionsByCountryCode: ITransactionsIATIResponse =
        await this.iatiBnd.getTransactionsByCountryCode(
          countryCode,
          rows,
          start,
          this.iatiSrvices,
          logger
        );
      start = rows;
      const requestLimit: number = 5;
      const arrayPromises: Promise<ITransactionsIATIResponse>[] = [];
      const transactrionsLimitByRequest: number = 10000;
      const rowsMissing: number = transactionsByCountryCode.response.numFound - rows;
      if (rowsMissing > 0) {
        if (rowsMissing > transactrionsLimitByRequest) {
          rows = Math.trunc(rowsMissing / requestLimit);
          const rowsResidue: number =
            transactionsByCountryCode.response.numFound - (rows * requestLimit);
          for (let i = 0; i < requestLimit; i++) {
            const rowsToFound: number = i + 1 >= requestLimit ?
              rows += rowsResidue
              : rows;
            arrayPromises.push(
              this.iatiBnd.getTransactionsByCountryCode(
                countryCode,
                rowsToFound,
                start,
                this.iatiSrvices,
                logger
              )
            );
            start += rows;
          }
        } else {
          arrayPromises.push(
            this.iatiBnd.getTransactionsByCountryCode(
              countryCode,
              rowsMissing,
              start,
              this.iatiSrvices,
              logger
            )
          );
        }
      }
      const transactionsRequestList: ITransactionsIATIResponse[] = [transactionsByCountryCode];
      transactionsRequestList.push(...(await Promise.all(arrayPromises)));
      /* #endregion */

      logger?.debug({
        logKey: 'createRanking',
        data: {
          transactionsRequestListLength: transactionsRequestList.length
        }
      });

      const ranking: IRankingResponse = {};
      /* #region  build ranking and transactions to save */
      const minYearAllow: number = moment().year() - limitYear;
      let breakRanking: boolean = false;
      let transactionsTosave: Partial<Transaction>[] = [];
      for (let i = 0; i < transactionsRequestList.length; i++) {
        const transactions: IIATIDoc[] = transactionsRequestList[i].response.docs;
        for (let j = 0; j < transactions.length; j++) {
          const year: number = moment(
            this.iatiBnd.clearTransactionStr(
              transactions[j].transaction_transaction_date_iso_date
            )
          ).year();
          if (minYearAllow >= year) {
            breakRanking = true;
            break;
          }
          const providerName: string = this.iatiBnd.clearTransactionStr(
            transactions[j].transaction_provider_org_narrative
          );
          const amountOriginal: number = this.iatiBnd.clearTransactionValue(
            transactions[j].transaction_value
          );
          if (!providerName || amountOriginal < 1) {
            continue;
          }
          const amountInUsd: number = this.iatiBnd.clearTransactionStr(
            transactions[j].default_currency) === 'USD' ? amountOriginal
              : await this.iatiBnd.convertAmountToUSD(amountOriginal);
          if (!ranking[year]) {
            ranking[year] = {
              [providerName]: amountInUsd
            };
          } else {
            if (!ranking[year][providerName]) {
              ranking[year][providerName] = amountInUsd;
            } else {
              const currentAmount: number = ranking[year][providerName];
              ranking[year][providerName] = currentAmount + amountInUsd;
            }
          }
          if (transactionsTosave.length < 10) {
            transactionsTosave.push({
              year: `${year}`,
              providerName,
              countryCode,
              amountInUsd,
              amount: amountOriginal,
              iatiId: this.iatiBnd.clearTransactionStr(
                transactions[j].iati_identifier
              )
            });
          } else {
            transactionsTosave.pop();
            transactionsTosave = [{
              year: `${year}`,
              providerName,
              countryCode,
              amountInUsd,
              amount: amountOriginal,
              iatiId: this.iatiBnd.clearTransactionStr(
                transactions[j].iati_identifier
              )
            }, ...transactionsTosave];
          }
        }
        if (breakRanking) {
          break;
        }
      }
      /* #endregion */

      logger?.debug({
        logKey: 'createRanking',
        data: {
          // ranking
          transactionsTosave
        }
      });

      /* #region  save data */
      const rankingsToSaveInDb: Partial<Ranking>[] = [];
      const years: string[] = Object.keys(ranking);
      for (const year of years) {
        const prividers: string[] = Object.keys(ranking[+year]);
        for (const provider of prividers) {
          rankingsToSaveInDb.push({
            providerName: provider,
            amountInUsd: ranking[+year][provider],
            countryCode,
            year
          });
        }
      }
      const [rankingSaved, transactionsSaved] = await Promise.all([
        this.rankingCrud.createMany(rankingsToSaveInDb),
        this.transactionCrud.createMany(transactionsTosave)
      ]);
      // logger?.debug({
      //   logKey: 'createRanking',
      //   data: {
      //     rankingSaved,
      //     transactionsSaved
      //   }
      // });

      /* #endregion */

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
