import { HttpMethods } from '../constants';
import { FetchRequest, Logger } from '../utils';

class IATISrvices {
  private readonly url: string;
  private readonly token: string;

  constructor() {
    this.url = process.env.IATI_URL || '';
    this.token = process.env.IATI_TOKEN || '';
  }

  async getTransactions(
    query: { [keyof: string]: any } | null = null,
    logger?: Logger
  ): Promise<any> {
    const fetchRequest: FetchRequest = new FetchRequest();
    const collection: string = 'transaction';
    const responsetype: string = 'select';
    const data = await fetchRequest.sendRequest(
      this.url,
      `${collection}/${responsetype}`,
      HttpMethods.GET,
      {
        'Ocp-Apim-Subscription-Key': this.token,
        'Cache-Control': 'no-cache'
      },
      null,
      query,
      false,
      logger
    );
    return data;    
  }

}

export { IATISrvices };
