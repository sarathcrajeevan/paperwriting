import { InitializeCalendarDateOptions, widgetDefaults } from './consts';
import { Logger as BookingsViewerBiLogger } from '@wix/bi-logger-wixboost-ugc';
import { CalendarState } from '../../components/BookingCalendar/controller';
import {
  WixOOISDKAdapter,
  BookingsQueryParams,
} from '@wix/bookings-adapter-ooi-wix-sdk';
import { BusinessInfo } from '@wix/bookings-uou-types';
import settingsParams from '../../components/BookingCalendar/settingsParams';
import { LayoutOptions } from '../../types/types';

export interface CalendarBiLogger extends BookingsViewerBiLogger {
  update: (state: CalendarState) => void;
}

export function createCalendarBiLogger(
  flowAPI: any,
  initialState: CalendarState,
  wixSdkAdapter: WixOOISDKAdapter,
  settings: any,
  businessInfo?: BusinessInfo,
): CalendarBiLogger {
  const { bi: viewerBiLogger } = flowAPI;

  const getServiceLocationIds = (state: CalendarState) =>
    state?.selectedService?.locations
      ?.map((location) => location?.businessLocation?.id)
      .filter((locationId) => locationId !== undefined);
  const getServiceStaffIds = (state: CalendarState) =>
    state?.selectedService?.staffMembers?.map((staffMember) => staffMember.id);

  const getServiceProperties = (state: CalendarState) =>
    JSON.stringify({
      locationIds: getServiceLocationIds(state),
      staffMemberIds: getServiceStaffIds(state),
      paymentOptions: state?.selectedService?.payment?.offeredAs,
      connectedSolutions: [],
    });

  const getSelectedFilters = (state: CalendarState) =>
    JSON.stringify(state.filterOptions);

  const mapStateToDefaultBiParams = (state: CalendarState) => {
    return {
      serviceType: state?.selectedService?.info?.type,
      serviceId: state?.selectedService?.id,
      selectedTimezone: state?.selectedTimezone,
      errorMessage: JSON.stringify(state?.calendarErrors),
      serviceProperties: getServiceProperties(state),
      selectedFilters: getSelectedFilters(state),
      selectedDate: state?.selectedDate,
      selectedRange: JSON.stringify(state?.selectedRange),
      bookingId: state?.rescheduleBookingDetails?.id,
    };
  };

  const updateDefaultBiParams = (state: CalendarState) => {
    viewerBiLogger.util.updateDefaults(mapStateToDefaultBiParams(state));
  };

  let layout = LayoutOptions.DAILY_MONTH;
  if (
    flowAPI.experiments.enabled('specs.bookings.UoUWeeklyCalendarOOILiveSite')
  ) {
    layout = settings.get(settingsParams.calendarLayout);
  }

  viewerBiLogger.util.updateDefaults({
    ...widgetDefaults,
    referralInfo: wixSdkAdapter.getUrlQueryParamValue(
      BookingsQueryParams.REFERRAL,
    ),
    businessProperties: JSON.stringify({
      language: businessInfo?.language,
      countryCode: businessInfo?.countryCode,
    }),
    ...mapStateToDefaultBiParams(initialState),
    defaultDateAtFirstLoad: InitializeCalendarDateOptions.TODAY,
    layout,
  });

  return Object.assign(viewerBiLogger, {
    update: updateDefaultBiParams,
  }) as CalendarBiLogger;
}
