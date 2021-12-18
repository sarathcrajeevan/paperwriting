import { BiLoggerAdapterBuilder } from '@wix/bookings-adapters-reporting/dist/src/bi-logger/bi-logger-adapter';
import { AdditionalBiProps } from '../../WidgetApp/adapters/reporting/bi-logger/bi-logger';
import { FilterByOptions } from '../../Shared/appKeys/SettingsKeys';

export enum BIEvent {
  TAB_NAVIGATION = 112,
  OPEN_SETTINGS = 160,
  DISPLAY_CHANGED = 202,
  ADD_SERVICE = 142,
  MANAGE_OFFERINGS = 275,
  CUSTOMIZE_WIDGET = 322,
  IMAGE_SELECTION = 126,
  ELEMENT_CHANGED = 330,
  RESOURCE_SELECTED = 195,
  OPEN_PACKAGE_PICKER = 156,
  FILTER_CHANGED = 449,
}

export const WIDGET_SETTINGS_BI_REFFERAL = {
  WIDGET_SETTINGS_SERVICES: 'service-widget/services',
};

export const serviceListReferralInfo = 'service_list_widget';
export const widgetReferralInfo = 'widget';
export const widgetSettingEditorReferralInfo = 'widget_settings';

export class BILogger {
  private readonly logger: any;

  constructor(Wix, additionalBiProps = {}) {
    this.logger = new BiLoggerAdapterBuilder()
      .withWebLogger({
        Wix,
        biLoggerEndPoint: 'wixboost-users',
        additionalBiProps,
      })
      .build();
  }

  logNavigateFrom(
    tabName: string,
    { isEmptyState = false, referralInfo = widgetReferralInfo } = {},
  ) {
    return this.logger.log({
      selection: tabName,
      isEmptyState,
      referralInfo,
      evid: BIEvent.TAB_NAVIGATION,
    });
  }

  logOpenSettingsWith({ isEmptyState }: { isEmptyState: boolean }) {
    return this.logger.log({
      referralInfo: widgetReferralInfo,
      isEmptyState,
      evid: BIEvent.OPEN_SETTINGS,
    });
  }

  logAddFirstServiceFrom(pageName: string) {
    return this.logger.log({
      referral_info: widgetSettingEditorReferralInfo,
      pageName,
      evid: BIEvent.ADD_SERVICE,
    });
  }

  logManageOfferings({ referral = 'service-widget' } = {}) {
    return this.logger.log({
      evid: BIEvent.MANAGE_OFFERINGS,
      referral,
    });
  }

  logCustomiseWidget() {
    return this.logger.log({
      evid: BIEvent.CUSTOMIZE_WIDGET,
    });
  }

  logDisplayChange(fieldName: string, status: boolean) {
    return this.logger.log({
      evid: BIEvent.DISPLAY_CHANGED,
      info: 'displayService' + fieldName,
      isShow: status,
    });
  }

  logServicesFilterChange(filterBy: FilterByOptions) {
    const filterByText =
      filterBy === FilterByOptions.BY_SERVICES ? 'service_name' : 'location';
    return this.logger.log({
      evid: BIEvent.FILTER_CHANGED,
      filterBy: filterByText,
    });
  }

  logFullStretchChange(isFull: boolean) {
    return this.logger.log({
      evid: BIEvent.IMAGE_SELECTION,
      selection: isFull ? 'stretch_full' : 'no_stretch',
      page_name: widgetReferralInfo,
      type: 'single_service',
      element: 'width',
    });
  }

  logSelectResource({
    view_type,
    offeringType,
    filterByOption,
    checkedLocation,
  }: {
    view_type: string;
    offeringType?: string;
    filterByOption?: FilterByOptions;
    checkedLocation?: boolean;
  }) {
    const filterInfo = filterByOption
      ? filterByOption === FilterByOptions.BY_SERVICES
        ? { filterBy: 'service_name' }
        : { filterBy: 'location', checkedLocation }
      : {};
    const type = offeringType ? { type: offeringType } : {};

    return this.logger.log({
      evid: BIEvent.RESOURCE_SELECTED,
      view_type,
      pageName: widgetReferralInfo,
      ...filterInfo,
      ...type,
    });
  }

  logOpenPackagePicker() {
    return this.logger.log({
      evid: BIEvent.OPEN_PACKAGE_PICKER,
      referral_info: widgetSettingEditorReferralInfo,
    });
  }

  logElementChanged({
    tabName,
    element,
    selection,
  }: {
    tabName: string;
    element: string;
    selection: string | number | boolean;
  }) {
    return this.logger.log({
      tabName,
      element,
      selection,
      platformName: 'editor',
      appName: widgetSettingEditorReferralInfo,
      evid: BIEvent.ELEMENT_CHANGED,
    });
  }
}

export function getSettingsBiLogger(Wix: any, biProps: AdditionalBiProps) {
  const additionalBiProps = {
    bookingsPlatform: biProps.isNewBookingsPlatform
      ? 'new_bookings_server'
      : null,
  };
  return new BILogger(Wix, additionalBiProps);
}
