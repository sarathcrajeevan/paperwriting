import { dsl } from '@wix/yoshi-serverless/wrap';

export const getSchedule = dsl({
          functionName: 'getSchedule',
          fileName: 'api/schedule.api',
        });