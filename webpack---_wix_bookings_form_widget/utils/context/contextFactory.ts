import { ControllerFlowAPI, ReportError } from '@wix/yoshi-flow-editor';
import { WixOOISDKAdapter } from '@wix/bookings-adapter-ooi-wix-sdk';
import { FormApi } from '../../api/FormApi';
import { TFunction } from '../../types/types';
import { FormBiLogger } from '../bi/biLoggerFactory';

export type FormContext = {
  t: TFunction;
  settings: ControllerFlowAPI['settings'];
  experiments: ControllerFlowAPI['experiments'];
  wixSdkAdapter: WixOOISDKAdapter;
  formApi: FormApi;
  biLogger?: FormBiLogger;
  reportError: ReportError;
};

export const createFormContext = ({
  t,
  flowApi,
  wixSdkAdapter,
  formApi,
  biLogger,
  reportError,
}: {
  t: TFunction;
  flowApi: ControllerFlowAPI;
  wixSdkAdapter: WixOOISDKAdapter;
  formApi: FormApi;
  biLogger?: FormBiLogger;
  reportError: ReportError;
}): FormContext => {
  return {
    t,
    settings: flowApi.settings,
    experiments: flowApi.experiments,
    wixSdkAdapter,
    formApi,
    biLogger,
    reportError,
  };
};
