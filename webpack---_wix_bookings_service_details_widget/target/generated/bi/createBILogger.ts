
import ownerSchemaLogger from '@wix/bi-logger-wixboost-users';
import visitorSchemaLogger from '@wix/bi-logger-wixboost-ugc';

const createBILogger = <TLogger>(
    schemaLogger: (webOrMobileLogger: any) => (userConfig?: any) => TLogger,
) => (factory: any) => (userConfig: any = {}) => {
  return schemaLogger(factory)(userConfig);
}

export const createOwnerBILogger = createBILogger(ownerSchemaLogger);
export const createVisitorBILogger = createBILogger(visitorSchemaLogger);
