import { inspect } from 'util';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import { HttpStatus, HttpMethods, axiosConfig } from './../constants';
import qs from 'qs';
import { Logger } from '../utils';

class FetchRequest {
  private readonly timeout = axiosConfig.requests.timeout;
  private readonly logger: Logger;

  constructor(
    enableRetry = true,
    retries: number = axiosConfig.requests.retries
  ) {
    if (enableRetry) {
      this.enableRetry(retries);
    }
    this.logger = new Logger(
      'Axios',
      'FetchRequest.ts'
    );
  }

  private createQueryStringFromObject(params: { [keyof: string]: any }): string {
    const queryString = qs.stringify(params, { encodeValuesOnly: true });
    return `?${queryString}`;
  }

  async sendRequest(
    url: string,
    path: string | null,
    method: HttpMethods,
    headers: any = {},
    body: any = {},
    query: { [keyof: string]: any } | null = null,
    printResult: boolean = true
  ): Promise<any> {
    let route = '';
    if (path) {
      route = `${url}/${path}${
        query ? this.createQueryStringFromObject(query) : ''
      }`;
    } else {
      route = `${url}${query ? this.createQueryStringFromObject(query) : ''}`;
    }

    const axiosConfig: any = {
      method,
      url: route,
      headers,
      timeout: this.timeout,
    };

    if (method === HttpMethods.GET) {
      Object.assign(axiosConfig, { params: body });
    } else {
      Object.assign(axiosConfig, { data: body });
    }

    this.logger.info({
      logKey: 'sendRequest',
      data: { axiosConfig }
    });
    try {
      const result = await axios(axiosConfig);

      if (printResult) {
        this.logger.info({
          logKey: 'sendRequest',
          data: {
            route,
            status: result.status,
            data: result.data,
          }
        });
      }
      if (result.status < HttpStatus.badRequest) {
        return Promise.resolve(result.data);
      }
      return Promise.reject(result.data);
    } catch (error) {
      this.logger.error({
        logKey: 'sendRequest',
        message: `Error requesting ${route}`,
        error
      });
      throw error;
    }
  }

  private retryCondition(error: any) {
    return !error.response || error.response.status !== HttpStatus.ok;
  }

  private enableRetry(retries: number) {
    axiosRetry(axios, {
      retries,
      retryDelay: axiosRetry.exponentialDelay,
      retryCondition: this.retryCondition,
    });
  }
}

export { FetchRequest };
