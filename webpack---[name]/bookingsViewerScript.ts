import {
  IInitAppForPage,
  IPlatformAPI,
  IPlatformServices,
  IWixAPI,
  IAppData,
  IWidgetControllerConfig,
} from '@wix/native-components-infra/dist/es/src/types/types';
import { initRaven } from '@wix/bookings-adapters-reporting/dist/src/sentry/sentry-adapter';
import { createWidgetController } from '@wix/bookings-widget-viewer/dist/src/platform/create-widget-controller';
import {
  createOfferingListWidgetController,
  createMainPageController,
} from '@wix/bookings-widget/dist/es/src';
import {
  BookingsErrorReporter,
  withBookingsErrorReporter,
} from '@wix/bookings-adapters-reporting/dist/src/error-reporter/error-adapter';
import {
  dailyTimeTableCreateController,
  bookButtonCreateController,
  staffListCreateController,
  DAILY_TIMETABLE_WIDGET_ID,
  BOOK_BUTTON_WIDGET_ID,
  STAFF_LIST_WIDGET_ID,
} from '@wix/bookings-app-builder-controllers';

const BOOKINGS_WIDGET_ID = '14756c3d-f10a-45fc-4df1-808f22aabe80';
const BOOKINGS_OFFERING_LIST_WIDGET_ID = 'cc882051-73c9-41a6-8f90-f6ebc9f10fe1';
const BOOKINGS_LIST_PAGE_ID = '621bc837-5943-4c76-a7ce-a0e38185301f';

const controllerByType = {
  [BOOKINGS_WIDGET_ID]: createWidgetController,
  [BOOKINGS_OFFERING_LIST_WIDGET_ID]: createOfferingListWidgetController,
  [BOOKINGS_LIST_PAGE_ID]: createMainPageController,
  [DAILY_TIMETABLE_WIDGET_ID]: dailyTimeTableCreateController,
  [BOOK_BUTTON_WIDGET_ID]: bookButtonCreateController,
  [STAFF_LIST_WIDGET_ID]: staffListCreateController,
};

let ravenReporter: BookingsErrorReporter = () => null;

export function createControllers(
  controllerConfigs: IWidgetControllerConfig[],
  controllerInstances?,
) {
  return controllerConfigs.map(async (config) => {
    if (controllerInstances?.[config.type]) {
      const factory = controllerInstances[config.type].default;
      return withBookingsErrorReporter(ravenReporter)(
        await factory({
          controllerConfig: config,
          // Optional field that will populate Providers and flowAPI in controller with experiments, translations, fedopsLogger, bilogger
          appData: {
            ravenReporter,
            __prepopulated: {
              experiments: undefined,
              biLogger: undefined,
            },
          },
        }),
      );
    }
    return controllerByType[config.type]
      ? withBookingsErrorReporter(ravenReporter)(
          await (controllerByType[config.type] as any)(config, ravenReporter),
        )
      : undefined;
  });
}

export const initAppForPage: IInitAppForPage = async (
  initParams: IAppData,
  apis: IPlatformAPI,
  namespaces: IWixAPI,
  platformServices: IPlatformServices,
) => {
  ravenReporter = initRaven(platformServices, initParams);
};
