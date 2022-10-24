interface IRankingResponse {
  [keyof: number]: {
    [keyof: string]: number;
  };
}

interface IIATIDoc {
  recipient_country_code: string;
  recipient_country_narrative: string;
  transaction_provider_org_ref: string;
  transaction_provider_org_narrative: string;
  transaction_value: number;
  default_currency: string;
  transaction_transaction_date_iso_date: string;
  iati_identifier: string;
}

interface IIATIResponse {
  numFound: number;
  start: number,
  numFoundExact: boolean;
  docs: IIATIDoc[];
}

interface ITransactionsIATIResponse {
  responseHeader: {
    zkConnected: boolean;
    status: number;
    QTime: number;
    params: {
      [keyof: string]: string;
    }
  };
  response: IIATIResponse;
}

export {
  IRankingResponse,
  ITransactionsIATIResponse,
  IIATIResponse,
  IIATIDoc
};
