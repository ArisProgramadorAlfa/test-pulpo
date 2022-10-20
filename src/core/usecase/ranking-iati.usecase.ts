import { IATIImpl } from "../implements";
import { IIATIBnd } from "../interfaces";
import { IATISrvices } from "../services";
import { Logger } from "../utils";

class RankingIATIUsecase {
  private readonly iatiImpl: IIATIBnd;
  private readonly iatiSrvices: IATISrvices;

  constructor() {
    this.iatiImpl = new IATIImpl();
    this.iatiSrvices = new IATISrvices();
  }

  async getRankingByCountryCode(
    countryCode: string,
    logger?: Logger
  ): Promise<any> {
    try {
    const rows = 10;
    const start = 0;
    const transactionsByCountryCode = await this.iatiImpl.getTransactionsByCountryCode(
      countryCode,
      rows,
      start,
      this.iatiSrvices
    );
    logger?.debug({
      logKey: 'getRankingByCountryCode',
      data: { transactionsByCountryCode }
    });
    return transactionsByCountryCode;
    } catch(error) {
      logger?.error({
        logKey: 'getRankingByCountryCode',
        error
      });
      throw error;
    }
  }
}

export { RankingIATIUsecase };
