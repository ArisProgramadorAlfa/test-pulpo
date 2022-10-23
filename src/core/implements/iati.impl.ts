import { Country, Provider, Ranking, Transaction } from "@database/postgres";
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
    rankingList.forEach(ranking => {
      const year: string = ranking.year;
      const countryName: string = ranking.country?.name!;
      const amount: number = ranking.amountInUsd;
      if (!rankingFormatted[year]) {
        rankingFormatted[year] = {
          [countryName]: amount
        }
      }
      if (!rankingFormatted[year][countryName]) {
        rankingFormatted[year][countryName] = amount;
      }
    });

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
      "countryId",
      'providerId',
    ];
    const relations: string[] = ['country', 'provider'];
    const rankingFound: Ranking[] = await rankingCrud.getMany(
      where,
      fieldsSelected,
      relations
    );
    const rankingFormatted: IRankingResponse = this.formatRanking(rankingFound);

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
          ",dataset_generated_datetime" +
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
}

export { IATIImpl };



