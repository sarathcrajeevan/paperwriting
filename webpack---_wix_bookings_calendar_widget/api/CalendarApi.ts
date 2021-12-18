import { Booking } from '@wix/ambassador-bookings-server/types';
import { CatalogData, Service, ServiceType } from '@wix/bookings-uou-types';
import {
  BookingsQueryParams,
  WixOOISDKAdapter,
} from '@wix/bookings-adapter-ooi-wix-sdk';
import {
  QueryAvailabilityRequest,
  QueryAvailabilityResponse,
  Slot,
} from '@wix/ambassador-availability-calendar/types';
import {
  convertRfcTimeToLocalDateTimeStartOfDay,
  getTodayLocalDateTimeStartOfDay,
} from '../utils/dateAndTime/dateAndTime';
import { GetServiceResponse } from '@wix/ambassador-services-catalog-server/http';
import { createDummyCatalogData } from './dummyData/dummyCatalogData';
import { createDummySlots } from './dummyData/dummySlotsData';
import { BookingsApi } from './BookingsApi';
import { CalendarApiInitParams } from './types';
import {
  CalendarErrors,
  LocalDateTimeRange,
  Optional,
  SlotsAvailability,
} from '../types/types';
import { EmptyStateType } from '../components/BookingCalendar/ViewModel/emptyStateViewModel/emptyStateViewModel';
import settingsParams from '../components/BookingCalendar/settingsParams';
import { CalendarState } from '../components/BookingCalendar/controller';
import { ControllerFlowAPI, ControllerParams } from '@wix/yoshi-flow-editor';
import { AddError } from '../components/BookingCalendar/Actions/addError/addError';
import { getOnlyFutureSlotAvailabilities } from '../utils/timeSlots/timeSlots';
import {
  isCalendarFlow,
  isServiceAClass,
} from '../utils/ServiceUtils/ServiceUtils';
import { createDummyDateAvailability } from './dummyData/dummyDateAvailability';
import { Balance } from '@wix/ambassador-pricing-plan-benefits-server/types';

export const CALENDAR_PAGE_URL_PATH_PARAM = 'booking-calendar';

export class CalendarApi {
  private readonly flowAPI: ControllerFlowAPI;
  private wixSdkAdapter: WixOOISDKAdapter;
  private bookingsApi: BookingsApi;
  private readonly reportError: ControllerParams['flowAPI']['reportError'];

  constructor({ wixSdkAdapter, reportError, flowAPI }: CalendarApiInitParams) {
    this.flowAPI = flowAPI;
    this.wixSdkAdapter = wixSdkAdapter;
    this.reportError = reportError;
    this.bookingsApi = new BookingsApi({
      authorization: wixSdkAdapter.getInstance(),
      baseUrl: wixSdkAdapter.getServerBaseUrl(),
    });
  }

  async getCatalogData({
    onError,
  }: {
    onError: (type: EmptyStateType) => void;
  }): Promise<Optional<CatalogData & { seoData?: GetServiceResponse[] }>> {
    if (this.wixSdkAdapter.isEditorMode()) {
      const catalogData = await this.bookingsApi.getCatalogData({
        servicesOptions: {
          include: false,
        },
        resourcesOptions: {
          include: false,
        },
      });
      const dummyCatalogData = createDummyCatalogData(this.flowAPI);
      dummyCatalogData.businessInfo = catalogData.businessInfo;
      return dummyCatalogData;
    }

    const serviceSlug = await this.wixSdkAdapter.getServiceSlug(
      CALENDAR_PAGE_URL_PATH_PARAM,
    );

    const resourceSlug = this.getResourceSlug();

    try {
      const catalogData: CatalogData = await this.bookingsApi.getCatalogData({
        servicesOptions: {
          slug: serviceSlug,
          include: true,
        },
        resourcesOptions: {
          slug: resourceSlug,
          include: !!resourceSlug,
        },
      });

      this.filterServicesIfNeeded(serviceSlug, catalogData);

      const {
        services: [service],
      } = catalogData;

      if (!service) {
        onError(EmptyStateType.SERVICE_NOT_FOUND);
        return;
      }

      return catalogData;
    } catch (e) {
      this.reportError(e);
      onError(EmptyStateType.SERVER_ERROR);
    }
  }

  async getNextAvailableDate(
    { fromAsLocalDateTime, toAsLocalDateTime }: LocalDateTimeRange,
    {
      state,
      settings,
      onError,
    }: { state: CalendarState; settings: any; onError: AddError },
  ) {
    try {
      const availabilityCalendarRequest: QueryAvailabilityRequest = this.buildQueryAvailabilityRequest(
        {
          from: fromAsLocalDateTime,
          to: toAsLocalDateTime,
          state,
          settings,
          getNextAvailableSlot: true,
        },
      );
      const slotAvailability = await this.bookingsApi.getSlotsAvailability(
        availabilityCalendarRequest,
      );

      const nextAvailableDate =
        slotAvailability?.availabilityEntries?.[0]?.slot?.startDate;
      if (nextAvailableDate) {
        const nextAvailable = convertRfcTimeToLocalDateTimeStartOfDay(
          nextAvailableDate!,
        );
        return nextAvailable;
      }

      onError(CalendarErrors.NO_NEXT_AVAILABLE_DATE_WARNING);
    } catch (e) {
      this.reportError(e);
      onError(CalendarErrors.NEXT_AVAILABLE_DATE_SERVER_ERROR);
    }
  }

  async getDateAvailability(
    { fromAsLocalDateTime, toAsLocalDateTime }: LocalDateTimeRange,
    { state, settings }: { state: CalendarState; settings: any },
  ) {
    if (this.wixSdkAdapter.isEditorMode()) {
      return createDummyDateAvailability();
    }

    try {
      let from;
      const { selectedTimezone } = state;
      const todayLocalDateTime = getTodayLocalDateTimeStartOfDay(
        selectedTimezone!,
      );
      if (new Date(toAsLocalDateTime) < new Date(todayLocalDateTime)) {
        return {};
      } else {
        from =
          new Date(todayLocalDateTime) > new Date(fromAsLocalDateTime)
            ? todayLocalDateTime
            : fromAsLocalDateTime;
      }
      const availabilityCalendarRequest: QueryAvailabilityRequest = this.buildQueryAvailabilityRequest(
        {
          from,
          to: toAsLocalDateTime,
          state,
          settings,
          shouldLimitPerDay: true,
        },
      );

      return await this.bookingsApi.getSlotsAvailability(
        availabilityCalendarRequest,
      );
    } catch (e) {
      this.reportError(e);
    }
  }

  async getSlotsInRange(
    { fromAsLocalDateTime, toAsLocalDateTime }: LocalDateTimeRange,
    {
      state,
      settings,
      onError,
    }: {
      state: CalendarState;
      settings: any;
      onError: AddError;
    },
  ): Promise<Optional<QueryAvailabilityResponse>> {
    if (this.wixSdkAdapter.isEditorMode()) {
      const isWeeklyCalendarEnabled = this.flowAPI.experiments.enabled(
        'specs.bookings.UoUWeeklyCalendarOOI',
      );
      const calendarLayout = settings.get(settingsParams.calendarLayout);
      return createDummySlots({
        from: fromAsLocalDateTime,
        calendarLayout,
        isWeeklyCalendarEnabled,
      });
    }

    try {
      const availabilityCalendarRequest: QueryAvailabilityRequest = this.buildQueryAvailabilityRequest(
        {
          from: fromAsLocalDateTime,
          to: toAsLocalDateTime,
          state,
          settings,
        },
      );

      const slotAvailability = await this.bookingsApi.getSlotsAvailability(
        availabilityCalendarRequest,
      );

      return {
        ...slotAvailability,
        availabilityEntries: getOnlyFutureSlotAvailabilities(slotAvailability),
      };
    } catch (e) {
      this.reportError(e);
      onError(CalendarErrors.AVAILABLE_SLOTS_SERVER_ERROR);
    }
  }

  async getBookingDetails({
    onError,
  }: {
    onError: (type: EmptyStateType) => void;
  }): Promise<Optional<Booking>> {
    const bookingId = this.wixSdkAdapter.getUrlQueryParamValue(
      BookingsQueryParams.BOOKING_ID,
    );
    if (!bookingId || this.wixSdkAdapter.isSSR()) {
      return;
    }

    try {
      return await this.bookingsApi.getBookingDetails(bookingId);
    } catch (e) {
      this.reportError(e);
      const errorType =
        e?.httpStatus === 403
          ? EmptyStateType.GET_BOOKING_DETAILS_ACCESS_DENIED
          : EmptyStateType.GET_BOOKING_DETAILS_ERROR;
      onError(errorType);
    }
  }

  async rescheduleBooking({
    bookingId,
    service,
    slot,
    timezone,
    onError,
  }: {
    bookingId: string;
    service: Service;
    slot: Slot;
    timezone: string;
    onError: AddError;
  }) {
    try {
      if (isServiceAClass(service)) {
        return this.bookingsApi.rescheduleClassBooking({
          bookingId,
          sessionId: slot.sessionId!,
        });
      } else {
        return this.bookingsApi.rescheduleAppointmentBooking({
          bookingId,
          scheduleId: slot.scheduleId!,
          timezone,
          start: slot.startDate!,
          end: slot.endDate!,
          staffMembersScheduleIds: [slot.resource!.scheduleId!],
          location: slot.location,
        });
      }
    } catch (e) {
      this.reportError(e);
      onError(CalendarErrors.RESCHEDULE_SERVER_ERROR);
    }
  }

  async getPurchasedPricingPlans({
    contactId,
  }: {
    contactId: string;
  }): Promise<Balance[]> {
    try {
      if (!this.wixSdkAdapter.isEditorMode()) {
        return await this.bookingsApi.getPurchasedPricingPlans({
          contactId,
          authorization: this.wixSdkAdapter.getInstance(),
        });
      }
      return [];
    } catch (e) {
      this.reportError(e);
      return [];
    }
  }

  private filterServicesIfNeeded = (
    serviceSlug: string,
    catalogData: CatalogData,
  ) => {
    if (catalogData?.services?.[0] && !serviceSlug) {
      const filteredServices = catalogData.services.filter((service: Service) =>
        isCalendarFlow(service),
      );
      catalogData.services = filteredServices;
    }
  };

  private getResourceSlug() {
    const staffQueryParam = this.wixSdkAdapter.getUrlQueryParamValue(
      BookingsQueryParams.STAFF,
    );

    if (staffQueryParam) {
      if (Array.isArray(staffQueryParam)) {
        return staffQueryParam[0];
      } else {
        return staffQueryParam;
      }
    }
  }

  private buildQueryAvailabilityRequest({
    from,
    to,
    state,
    settings,
    shouldLimitPerDay = false,
    getNextAvailableSlot = false,
  }: {
    from: string;
    to: string;
    state: CalendarState;
    settings?: any;
    shouldLimitPerDay?: boolean;
    getNextAvailableSlot?: boolean;
  }): QueryAvailabilityRequest {
    const { selectedTimezone, filterOptions, selectedService } = state;
    const onlyAvailableSlots =
      settings.get(settingsParams.slotsAvailability) ===
      SlotsAvailability.ONLY_AVAILABLE;
    const getNextSlotNotFullAndNotTooLateToBook =
      getNextAvailableSlot && !onlyAvailableSlots;
    return {
      timezone: selectedTimezone,
      ...(shouldLimitPerDay ? { slotsPerDay: 1 } : {}),
      query: {
        filter: {
          serviceId: [`${selectedService?.id}`],
          startDate: from,
          endDate: to,
          ...(onlyAvailableSlots ? { bookable: true } : {}),
          ...(filterOptions.STAFF_MEMBER?.length > 0
            ? { resourceId: filterOptions.STAFF_MEMBER }
            : {}),
          ...(filterOptions.LOCATION?.length > 0
            ? { 'location.businessLocation.id': filterOptions.LOCATION }
            : {}),
          ...(selectedService!.info.type === ServiceType.INDIVIDUAL ||
          getNextSlotNotFullAndNotTooLateToBook
            ? { openSpots: { $gte: '1' } }
            : {}),
          ...(getNextSlotNotFullAndNotTooLateToBook
            ? { 'bookingPolicyViolations.tooLateToBook': false }
            : {}),
        },
        ...(getNextAvailableSlot ? { cursorPaging: { limit: 1 } } : {}),
      },
    };
  }
}
