import { Country, Provider, Ranking, Transaction } from "@database/postgres";
import moment from "moment";
import { CountryCrud, ProviderCrud, RankingCrud } from "../crud";
import { IIATIBnd, IRankingResponse } from "../interfaces";
import { IATISrvices } from "../services";
import { Logger } from "../utils";

class IATIImpl implements IIATIBnd {

  async getCountry(
    countryCrud: CountryCrud,
    code: string,
    name?: string
  ): Promise<Country> {
    const where: Partial<Country>[] = [
      {
        code,
      },
    ];
    if (name) {
      where.push({ name });
    }
    const fieldsSelected: (keyof Partial<Country>)[] = [
      "id",
      "code",
      "name",
    ];
    const [countryFound]: Country[] = await countryCrud.getMany(
      where,
      fieldsSelected
    );
    return countryFound;
  }

  async getProvider(
    providerCrud: ProviderCrud,
    code?: string,
    name?: string
  ): Promise<Provider> {
    const where: Partial<Provider>[] = [];
    if (name) {
      where.push({ name });
    }
    if (code) {
      where.push({ code });
    }
    const fieldsSelected: (keyof Partial<Provider>)[] = [
      "id",
      "code",
      "name",
    ];
    const [providerFound]: Country[] = await providerCrud.getMany(
      where,
      fieldsSelected
    );
    return providerFound;
  }

  async getLastTransactions(
    maxTransactions: number,
    logger?: Logger
  ): Promise<Transaction> {
    throw new Error("Method not implemented.");
  }  

  formatRanking(
    rankingList: Ranking[]
  ): IRankingResponse {
    const rankingFormatted: IRankingResponse = {};
    for (let ranking of rankingList) {
      if (!rankingFormatted[+ranking.year]) {
        rankingFormatted[+ranking.year] = {
          [ranking.providerName]: +ranking.amountInUsd
        }
      }
      if (!rankingFormatted[+ranking.year][ranking.providerName]) {
        rankingFormatted[+ranking.year][ranking.providerName] = +ranking.amountInUsd;
      }
    };

    return rankingFormatted;
  }

  async getRankingFormatted(
    years: number[],
    rankingCrud: RankingCrud,
    countryId?: number,
    providerId?: number,
    logger?: Logger | undefined
  ): Promise<IRankingResponse> {
    const where: Partial<Ranking>[] = years.map(year => ({
      year: `${year}`
    }));
    if (countryId) {
      where.push({ countryId })
    }
    if (providerId) {
      where.push({ providerId })
    }
    const fieldsSelected: (keyof Partial<Ranking>)[] = [
      'year',
      'amountInUsd',
      "countryCode",
      'providerName'
    ];
    const relations: string[] = ['country', 'provider'];
    const order: { [keyof: string]: 'DESC' | 'ASC' } = {
      year: 'DESC',
      amountInUsd: 'DESC'
    };
    const rankingFound: Ranking[] = await rankingCrud.getMany(
      where,
      fieldsSelected,
      relations,
      order
    );
    logger?.info({
      logKey: 'getRankingByCountryCode',
      data: { rankingFound }
    });
    const rankingFormatted: IRankingResponse = this.formatRanking(rankingFound);
    logger?.info({
      logKey: 'getRankingByCountryCode',
      data: { rankingFormatted }
    });

    return rankingFormatted;
  }

  async getTransactionsByCountryCode(
    countryCode: string,
    rows: number,
    start: number,
    iatiServices: IATISrvices,
    logger?: Logger
  ): Promise<any> {
    try {
      const query = {
        q: `recipient_country_code:${countryCode}`,
        sort: "transaction_transaction_date_iso_date desc",
        fl:
          "recipient_country_code" +
          ",recipient_country_narrative" +
          ",transaction_provider_org_ref" +
          ",transaction_provider_org_narrative" +
          ",transaction_value" +
          ",default_currency" +
          ",transaction_transaction_date_iso_date" +
          ",iati_identifier",
        wt: "json",
        "q.op": "AND",
        rows: rows,
        start: start,
      };
      const response = await iatiServices.getTransactions(query, logger);
      return response;
    } catch (error) {
      logger?.error({
        logKey: "getRankingByCountryCode",
        error,
      });
      throw error;
    }
  }

  getArrayOfLastYears(
    maxYears: number
  ): number[] {
    const currentYear: number = moment().year();
    const currentsListTofound: number[] = [currentYear];
    for (let i = 1; i < maxYears; i++) {
      const lastYear: number = currentsListTofound[currentsListTofound.length - 1];
      currentsListTofound.push(lastYear - 1);
    }
    return currentsListTofound;
  }

  async convertAmountToUSD(
    amount: number
  ): Promise<number> { // TODO: create conversion to amount to usd
    return amount;
  }

  clearTransactionValue(value: number | number[]): number {
    const valueFound = Array.isArray(value) ?
      (value as number[])[0] : value;
    return Math.trunc(valueFound);
  }

  clearTransactionStr(value: string | string[]): string {
    const valueFound = Array.isArray(value) ?
      (value as string[])[0] : value;
    return valueFound;
  }

  orderedRanking(
    ranking: IRankingResponse
  ): IRankingResponse {
    const yearsKeys: string[] = Object.keys(ranking);
    yearsKeys.forEach((year: string) => {
      const providersKeys: string[] = Object.keys(ranking[+year]);
      const providersWithAmount: { providerName: string, amount: number }[] =
        providersKeys.map(providerName => ({
          providerName,
          amount: ranking[+year][providerName]
        }));
      const providersOrdered: { providerName: string, amount: number }[] =
        providersWithAmount.sort((a, b) => {
          if (+a.amount > +b.amount) {
            return -1;
          }
          if (+a.amount < +b.amount) {
            return 1;
          }
          return 0;
        });
      const rankingByYear: { [keyof: string]: number } = {};
      providersOrdered.forEach(providerByAmount => (
        rankingByYear[providerByAmount.providerName] = +providerByAmount.amount
      ));
      ranking[+year] = {
        ...rankingByYear
      };
    });
    return ranking;
  }
}

export { IATIImpl };



