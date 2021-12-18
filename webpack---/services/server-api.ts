import { HttpClient } from '@wix/http-client';
import uuid from 'uuid/v4';
import { CHAT_DEF_ID } from '../constants';

const prefixChatPayments = '/_api/chat-payments/api';
const prefixLcf = '/_api/auto-messages-server/v1/lcf';
const prefixCrmInbox = '/_api/crm-inbox-server/chat';
const widgetRenderPrefix = '/chat-widget-server/renderChatWidget';
const prefixReportChatWidgetOpen = '/serverless/chat-widget-service';
const chatEventReporterPrefix = '/serverless/chat-event-reporter';

const PAYMENT_SUMMARY = `${prefixChatPayments}/get-payment-summary`;
const LCF_POST_FORM_URL = `${prefixLcf}/submissions`;
const UPLOAD_TOKEN_URL = `${prefixCrmInbox}/uploadToken`;
const IMAGE_PREVIEW_PAGE = `${widgetRenderPrefix}/imagePreview`;
const REPORT_CHAT_WIDGET_OPEN_URL = `${prefixReportChatWidgetOpen}/chat-widget/v1/open`;
const VISITOR_ON_PAGE_URL = `${chatEventReporterPrefix}/report-event`;

export const ENDPOINTS = {
  PAYMENT_SUMMARY,
  LCF_POST_FORM_URL,
  UPLOAD_TOKEN_URL,
  IMAGE_PREVIEW_PAGE,
  REPORT_CHAT_WIDGET_OPEN_URL,
  VISITOR_ON_PAGE_URL,
};

export class ServerApi {
  constructor(private readonly httpClient: HttpClient) {}

  reportChatWidgetOpen() {
    return this.httpClient
      .post(REPORT_CHAT_WIDGET_OPEN_URL)
      .then((res) => res.data);
  }

  reportFirstExpand(allowInput: boolean) {
    return this.httpClient
      .post('/_api/auto-messages-server/v1/lcf/firstExpand', { allowInput })
      .then((res) => res.data);
  }

  reportVisitorOnPageEvent(
    pageId: string,
    visitorId: string,
    idempotencyKey: string,
    pageName: string,
  ) {
    return this.httpClient
      .post(VISITOR_ON_PAGE_URL, {
        eventIdentifier: {
          eventUniqueId: uuid(),
          eventType: 'chatVisitor/visitOnPage',
          sourceUniqueId: CHAT_DEF_ID,
        },
        eventUTCTime: new Date().toISOString(),
        detailedEventPayload: {
          pageId: {
            value: pageId,
          },
          visitorId: {
            value: visitorId,
          },
          pageName: {
            value: pageName,
          },
        },
        idempotencyKey,
      })
      .then((res) => res.data);
  }

  initChat({
    deviceType,
    correlationId,
    refresh,
    oldVisitorInstanceId,
    prevChatToken,
    randomChatroom,
  }: {
    deviceType?: string;
    correlationId?: string;
    refresh?: boolean;
    oldVisitorInstanceId?: string;
    prevChatToken?: string;
    randomChatroom?: boolean;
  }) {
    return this.httpClient
      .post('/_api/crm-inbox-server/chat/init', undefined, {
        params: {
          backend: 'CHAT',
          deviceType,
          correlationId,
          refresh,
          oldVisitorInstanceId,
          prevChatToken,
          randomChatroom,
        },
      })
      .then((res) => res.data);
  }

  getPaymentSummary(orderId: string) {
    return this.httpClient
      .get(PAYMENT_SUMMARY, {
        params: {
          orderId,
        },
      })
      .then((res) => {
        return res.data;
      });
  }

  postLCF(fields) {
    return this.httpClient
      .post(LCF_POST_FORM_URL, { fields })
      .then((res) => res.data);
  }

  getUploadToken() {
    return this.httpClient.get(UPLOAD_TOKEN_URL).then((res) => res.data);
  }
}
