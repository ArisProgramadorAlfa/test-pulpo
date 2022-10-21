import { IATISrvices } from "../services";

interface IIATIBnd {
  getTransactionsByCountryCode(
    countryCode: string,
    rows: number,
    start: number,
    iatiServices: IATISrvices
  ): Promise<any>;
}

export { IIATIBnd };
