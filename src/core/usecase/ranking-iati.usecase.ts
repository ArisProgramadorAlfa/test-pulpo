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
  ): Promise<IRankingResponse | null> {
    const logger: Logger = loggerSource || this.loggerLocal;
    try {
      const currentsListTofound: number[] = this.iatiBnd.getArrayOfLastYears(limitYears);
      logger?.info({
        logKey: 'getRankingByCountryCode',
        data: { currentsListTofound }
      });
      const ranking: IRankingResponse | null = await this.iatiBnd.getRankingFormatted(
        currentsListTofound,
        this.rankingCrud,
        countryCode,
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
    loggerSource?: Logger
  ): Promise<void> {
    const logger: Logger = loggerSource || this.loggerLocal;
    try {
      const lastTransactions: Transaction[] = await this.iatiBnd.getLastTransactions(
        countryCode,
        this.transactionCrud,
        10,
        logger
      );

      const rows = 10000;
      const start = 0;
      const localTransactions: ITransactionsIATIResponse =
        await this.iatiBnd.getTransactionsByCountryCode(
          countryCode,
          rows,
          start,
          this.iatiSrvices,
          logger
        );
      logger?.debug({
        logKey: 'updateRanking',
        data: { localTransactions }
      });

      const ranking: IRankingResponse = {};
      const transactionsTosave: Partial<Transaction>[] = [];
      const maxTransactionsToSave: number = 10;
      let indexLocalTransactions: number = 0;
      let matches: number = 0;
      const matchesAllows: number = 3;
      let stopSearch: boolean = false;
      const docsFound: IIATIDoc[] = localTransactions.response.docs;
      for (const doc of docsFound) {
        const year: number = moment(
          this.iatiBnd.clearTransactionStr(
            doc.transaction_transaction_date_iso_date
          )
        ).year();
        const providerName: string = this.iatiBnd.clearTransactionStr(
          doc.transaction_provider_org_narrative
        );
        const amountOriginal: number = this.iatiBnd.clearTransactionValue(
          doc.transaction_value
        );
        if (!providerName || amountOriginal < 1) {
          continue;
        }
        const currency: string = this.iatiBnd.clearTransactionStr(
          doc.default_currency
        );
        const amountInUsd: number = currency === "USD" ?
          amountOriginal
            : await this.iatiBnd.convertAmountToUSD(amountOriginal);
        const existDoc: boolean = doc.transaction_provider_org_narrative
          === lastTransactions[indexLocalTransactions].providerName
          || doc.iati_identifier
          === lastTransactions[indexLocalTransactions].iatiId
          || this.iatiBnd.clearTransactionValue(doc.transaction_value)
          === lastTransactions[indexLocalTransactions].amountInUsd;
        if(existDoc) {
          matches++;
          if (matches >= matchesAllows) {
            stopSearch = true;
            break;
          }
        } else {
          if (!ranking[year]) {
            ranking[year] = {
              [providerName]: amountInUsd,
            };
          } else {
            if (!ranking[year][providerName]) {
              ranking[year][providerName] = amountInUsd;
            } else {
              const currentAmount: number =
                ranking[year][providerName];
              ranking[year][providerName] =
                currentAmount + amountInUsd;
            }
          }
          if (transactionsTosave.length < maxTransactionsToSave) {
            transactionsTosave.push({
              year: `${year}`,
              providerName,
              countryCode,
              amountInUsd,
              amount: amountOriginal,
              iatiId: this.iatiBnd.clearTransactionStr(
                doc.iati_identifier
              ),
            });
          }
        }
      }
      if (stopSearch) {
        const promisesToSave: Promise<any>[] = [
          this.transactionCrud.createMany(transactionsTosave)
        ];
        const years: string[] = Object.keys(ranking);
        for (const year of years) {
          const prividers: string[] = Object.keys(ranking[+year]);
          for (const provider of prividers) {
            promisesToSave.push(
              this.iatiBnd.searchAndUpdateOrCreateRanking({
                providerName: provider,
                amountInUsd: ranking[+year][provider],
                countryCode,
                year,
              },
                this.rankingCrud
              ));
          }
        }
        await Promise.all(promisesToSave);
      }
      return;
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
