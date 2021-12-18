import { dsl } from '@wix/yoshi-serverless/wrap';

export const getConfig = dsl({
          functionName: 'getConfig',
          fileName: 'api/config.api',
        });