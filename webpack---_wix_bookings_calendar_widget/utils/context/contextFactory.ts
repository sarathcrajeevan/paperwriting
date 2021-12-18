import {
  CalendarBiLogger,
  createCalendarBiLogger,
} from '../bi/biLoggerFactory';
import { BusinessInfo, BusinessInfoBase } from '@wix/bookings-uou-types';
import { GetActiveFeaturesResponse } from '@wix/ambassador-services-catalog-server/types';
import {
  CalendarState,
  TFunction,
} from '../../components/BookingCalendar/controller';

import { CalendarApi } from '../../api/CalendarApi';
import { WixOOISDKAdapter } from '@wix/bookings-adapter-ooi-wix-sdk';
import { ReportError, ControllerFlowAPI } from '@wix/yoshi-flow-editor';
import Experiments from '@wix/wix-experiments';

export type GetContentParams = {
  settingsParam: any;
  translationKey: string;
  options?: object;
};

export type GetContent = (params: GetContentParams) => string;

export type CalendarContext = {
  wixSdkAdapter: WixOOISDKAdapter;
  biLogger: CalendarBiLogger;
  businessInfo?: BusinessInfoBase;
  isPricingPlanInstalled: boolean;
  isMemberAreaInstalled: boolean;
  activeFeatures?: GetActiveFeaturesResponse;
  calendarApi: CalendarApi;
  settings: ControllerFlowAPI['settings'];
  experiments: Experiments;
  reportError: ReportError;
  t: TFunction;
  getContent: GetContent;
};

export function createCalendarContext({
  flowAPI,
  businessInfo,
  activeFeatures,
  calendarApi,
  wixSdkAdapter,
  initialState,
  isPricingPlanInstalled,
  isMemberAreaInstalled,
}: {
  flowAPI: any;
  businessInfo?: BusinessInfo;
  activeFeatures?: GetActiveFeaturesResponse;
  calendarApi: CalendarApi;
  wixSdkAdapter: WixOOISDKAdapter;
  initialState: CalendarState;
  isPricingPlanInstalled: boolean;
  isMemberAreaInstalled: boolean;
}): CalendarContext {
  const {
    settings,
    translations: { t },
    reportError,
    experiments,
  } = flowAPI;
  const biLogger = createCalendarBiLogger(
    flowAPI,
    initialState,
    wixSdkAdapter,
    settings,
    businessInfo,
  );
  const getContent = ({
    settingsParam,
    translationKey,
    options = {},
  }: GetContentParams) =>
    settings.get(settingsParam) || t(translationKey, options);

  return {
    wixSdkAdapter,
    biLogger,
    businessInfo,
    activeFeatures,
    isPricingPlanInstalled,
    isMemberAreaInstalled,
    calendarApi,
    settings,
    experiments,
    reportError,
    t,
    getContent,
  };
}
