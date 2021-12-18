import { dsl } from '@wix/yoshi-serverless/wrap';

export const sendNotification = dsl({
          functionName: 'sendNotification',
          fileName: 'api/notification.api',
        });