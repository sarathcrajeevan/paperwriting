import { BOOKINGS_OFFERING_LIST_WIDGET_ID } from '@wix/bookings-uou-domain';
import { IBookingsAdditionalConfiguration } from './create-controller-additional-configuration';
import { FEDOPS_SERVICES_LIST_WIDGET_EDITOR } from '../../constants/bookings.const';

export class OfferingListWidgetAdditionalConfiguration
  implements IBookingsAdditionalConfiguration {
  getWidgetId = () => BOOKINGS_OFFERING_LIST_WIDGET_ID;

  getWidgetName = () => FEDOPS_SERVICES_LIST_WIDGET_EDITOR;

  prePageReady = () => Promise.resolve();

  onLocationChange = () => {};
}
