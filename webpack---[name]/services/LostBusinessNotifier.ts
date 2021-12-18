export const LOST_BUSINESS_NOTIFIER_NOTIFY_PATH = '/_serverless/wixstores-lost-business-notifier/lost-business';

export class LostBusinessNotifier {
  constructor(private readonly httpClient) {}

  public notify(): void {
    return this.httpClient.post(LOST_BUSINESS_NOTIFIER_NOTIFY_PATH);
  }
}
