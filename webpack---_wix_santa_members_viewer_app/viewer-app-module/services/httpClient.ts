import { HttpClient } from '@wix/http-client';
import { Config } from '../common/types';

export class HttpClientService {
  constructor(private readonly httpClient: HttpClient) {}

  public async get<T>(url: string): Promise<T | {}> {
    try {
      const response = await this.httpClient.get<T>(url);
      return response.data;
    } catch (error) {
      console.log('error fetching data', error.message);
      return {};
    }
  }

  public async post<T>(url: string, body: unknown): Promise<T | {}> {
    try {
      const response = await this.httpClient.post<T>(url, body);
      return response.data;
    } catch (error) {
      console.log('error posting data', error.message);
      return {};
    }
  }
}

export const getHttpClientFromConfig = (config: Config) => {
  const httpClient = config.essentials?.appEssentials?.httpClient;

  if (!httpClient) {
    throw new Error('HttpClient is not defined in the config');
  }

  return httpClient;
};
