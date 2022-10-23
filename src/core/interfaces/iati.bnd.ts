import { Country, Provider, Ranking, Transaction } from "@database/postgres";
import { CountryCrud, ProviderCrud, RankingCrud } from "../crud";
import { IATISrvices } from "../services";
import { Logger } from "../utils";
import { IRankingResponse } from "./iati";

interface IIATIBnd {
  getCountry(
    countryCrud: CountryCrud,
    code: string,
    name?: string
  ): Promise<Country>;
  getProvider(
    providerCrud: ProviderCrud,
    code?: string,
    name?: string
  ): Promise<Provider>;
  getLastTransactions(
    maxTransactions: number,
    logger?: Logger
  ): Promise<Transaction>;
  formatRanking(
    rankingList: Ranking[]
  ): IRankingResponse;
  getRankingFormatted(
    years: number[],
    rankingCrud: RankingCrud,
    countryId?: number,
    providerId?: number,
    logger?: Logger | undefined
  ): Promise<IRankingResponse>;
  getTransactionsByCountryCode(
    countryCode: string,
    rows: number,
    start: number,
    iatiServices: IATISrvices,
    logger?: Logger
  ): Promise<any>;
}

export { IIATIBnd };
