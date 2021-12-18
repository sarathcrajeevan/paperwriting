import { Plan } from '@wix/ambassador-checkout-server/types';
import _ from 'lodash';
import {
  Service,
  StaffMember,
  ReservedLocationIds,
  PricingPlan,
} from '@wix/bookings-uou-types';
import { CalendarState } from '../../components/BookingCalendar/controller';
import { BottomSectionStatus } from '../../components/BookingCalendar/ViewModel/widgetViewModel/widgetViewModel';
import { FilterTypes } from '../../components/BookingCalendar/ViewModel/filterViewModel/filterViewModel';
import {
  BookingsQueryParams,
  WixOOISDKAdapter,
} from '@wix/bookings-adapter-ooi-wix-sdk';
import { Booking } from '@wix/ambassador-bookings-server/types';
import { EmptyStateType } from '../../components/BookingCalendar/ViewModel/emptyStateViewModel/emptyStateViewModel';
import { SlotsStatus } from '../../types/types';
import { getValidPurchasedPricingPlansForService } from '../pricingPlans/pricingPlans';
import { Balance } from '@wix/ambassador-pricing-plan-benefits-server/types';

export function createInitialState({
  service,
  wixSdkAdapter,
  staffMembers,
  rescheduleBookingDetails,
  initialErrors,
  isAnonymousCancellationFlow,
  allPurchasedPricingPlans,
  isShowPricingPlanEndDateIndicationEnabled,
  isPricingPlanInstalled,
  isUserLoggedIn,
}: {
  service?: Service;
  wixSdkAdapter: WixOOISDKAdapter;
  staffMembers?: StaffMember[];
  rescheduleBookingDetails?: Booking;
  initialErrors: EmptyStateType[];
  isAnonymousCancellationFlow?: boolean;
  allPurchasedPricingPlans?: Balance[];
  isShowPricingPlanEndDateIndicationEnabled: boolean;
  isPricingPlanInstalled: boolean;
  isUserLoggedIn: boolean;
}): CalendarState {
  let locationFilterOptions: string[] = [];
  let selectedDate;
  const locationQueryParam = wixSdkAdapter.getUrlQueryParamValue(
    BookingsQueryParams.LOCATION,
  );
  if (locationQueryParam) {
    if (Array.isArray(locationQueryParam)) {
      locationFilterOptions = locationQueryParam;
    } else {
      locationFilterOptions.push(locationQueryParam);
    }

    locationFilterOptions = locationFilterOptions.filter(
      (location) => location !== ReservedLocationIds.OTHER_LOCATIONS,
    );
  }

  const staffFilterOptions: string[] = [];
  if (staffMembers) {
    const staffMemberId = staffMembers?.[0]?.id;
    if (
      staffMemberId &&
      _.find(service?.staffMembers, ({ id }) => id === staffMemberId)
    ) {
      staffFilterOptions.push(staffMemberId);
    }
  }

  if (isAnonymousCancellationFlow) {
    // @ts-expect-error
    const dateQueryParam = wixSdkAdapter.getUrlQueryParamValue('date');
    if (dateQueryParam) {
      if (Array.isArray(dateQueryParam)) {
        selectedDate = dateQueryParam[0];
      } else {
        selectedDate = dateQueryParam;
      }
    }
  }

  let purchasedPricingPlans: Plan[] = [];
  let servicePricingPlans: PricingPlan[] = [];

  if (isShowPricingPlanEndDateIndicationEnabled && isPricingPlanInstalled) {
    if (isUserLoggedIn) {
      servicePricingPlans =
        service?.payment.pricingPlanInfo?.pricingPlans || [];
      purchasedPricingPlans = getValidPurchasedPricingPlansForService({
        servicePricingPlans,
        allPurchasedPricingPlans: allPurchasedPricingPlans || [],
      });
    }
  }

  return {
    bottomSectionStatus: BottomSectionStatus.LOADING,
    slotsStatus: SlotsStatus.LOADING,
    selectedService: service,
    selectedDate,
    selectedTimezone: undefined,
    selectedTime: undefined,
    availableSlots: undefined,
    selectableSlotsAtSelectedTime: undefined,
    selectedRange: undefined,
    availableSlotsPerDay: undefined,
    selectedBookingPreferences: [],
    calendarErrors: [],
    rescheduleBookingDetails,
    dialog: undefined,
    filterOptions: {
      [FilterTypes.LOCATION]: locationFilterOptions,
      [FilterTypes.STAFF_MEMBER]: staffFilterOptions,
    },
    initialErrors,
    purchasedPricingPlans,
    isUserLoggedIn,
  };
}
