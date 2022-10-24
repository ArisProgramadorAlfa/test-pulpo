import { Country, Provider, Ranking, Transaction } from "@database/postgres";
import {
    CountryCrud,
    ProviderCrud,
    RankingCrud,
    TransactionCrud,
} from "../crud";
import { IATISrvices } from "../services";
import { Logger } from "../utils";
import { IRankingResponse, ITransactionsIATIResponse } from "./iati";

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
    countryCode: string,
    transactionCrud: TransactionCrud,
    maxTransactions: number,
    logger?: Logger
  ): Promise<Transaction[]>;
  formatRanking(rankingList: Ranking[]): IRankingResponse;
  getRankingFormatted(
    years: number[],
    rankingCrud: RankingCrud,
    countryCode: string,
    providerId?: number,
    logger?: Logger | undefined
  ): Promise<IRankingResponse | null>;
  getTransactionsByCountryCode(
    countryCode: string,
    rows: number,
    start: number,
    iatiServices: IATISrvices,
    logger?: Logger
  ): Promise<any>;
  getArrayOfLastYears(maxYears: number): number[];
  convertAmountToUSD(amount: number): Promise<number>;
  orderedRanking(ranking: IRankingResponse): IRankingResponse;
  clearTransactionValue(value: number | number[]): number;
  clearTransactionStr(value: string | string[]): string;
  getRequestsOfTransactions(
    countryCode: string,
    iatiServices: IATISrvices,
    loggerSource?: Logger
  ): Promise<ITransactionsIATIResponse[]>;
  buildRankingWithIatiRequests(
    transactionsRequestList: ITransactionsIATIResponse[],
    countryCode: string,
    limitYear: number,
    logger?: Logger
  ): Promise<{
    transactionsTosave: Partial<Transaction>[];
    ranking: IRankingResponse;
  }>;
  saveRankingAndTransactions(
    ranking: IRankingResponse,
    transactionsTosave: Partial<Transaction>[],
    countryCode: string,
    rankingCrud: RankingCrud,
    transactionCrud: TransactionCrud,
    logger?: Logger
  ): Promise<void>;
  searchAndUpdateOrCreateRanking(
    rankingData: Partial<Ranking>,
    rankingCrud: RankingCrud
  ): Promise<void>;
}

export { IIATIBnd };
