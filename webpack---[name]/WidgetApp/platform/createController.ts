import {
  createMainPageController,
  createOfferingListWidgetController,
} from './offering-list-widget-controller';

const BOOKINGS_LIST_PAGE_ID = '621bc837-5943-4c76-a7ce-a0e38185301f';

export default ({ controllerConfig, appData }) => {
  const ravenReporter = appData?.ravenReporter;
  if (controllerConfig.type === BOOKINGS_LIST_PAGE_ID) {
    return createMainPageController(controllerConfig, ravenReporter);
  } else {
    return createOfferingListWidgetController(controllerConfig, ravenReporter);
  }
};
