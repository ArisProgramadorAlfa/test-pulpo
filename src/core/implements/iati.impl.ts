import { IIATIBnd } from "../interfaces";
import { IATISrvices } from "../services";
import { Logger } from "../utils";

class IATIImpl implements IIATIBnd {
  async getTransactionsByCountryCode(
    countryCode: string,
    rows: number,
    start: number,
    iatiServices: IATISrvices,
    logger?: Logger
  ): Promise<any> {
    try {
      const query = {
        'q': `recipient_country_code:${countryCode}`,
        'sort': 'transaction_transaction_date_iso_date desc',
        'fl': 'recipient_country_code,transaction_provider_org_ref,transaction_receiver_org_narrative,transaction_provider_org_narrative,transaction_value,default_currency,transaction_transaction_date_iso_date,iati_identifier,dataset_generated_datetime',
        'wt': 'json',
        'q.op': 'AND',
        'rows': rows,
        'start': start
      };
      const response = await iatiServices.getTransactions(query);
      return response;
    } catch(error) {
      logger?.error({
        logKey: 'getRankingByCountryCode',
        error
      });
      throw error;
    }
  }
}

export { IATIImpl };



