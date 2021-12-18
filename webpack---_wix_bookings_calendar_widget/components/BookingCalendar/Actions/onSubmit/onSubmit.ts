import { ActionFactoryParams } from '../../../../utils/ControlledComponent/ControlledComponent.types';
import { CalendarState } from '../../controller';
import { CalendarContext } from '../../../../utils/context/contextFactory';
import { getBookingPreferencesForSelectedTime } from '../../../../utils/bookingPreferences/bookingPreferencesForSelectedTime';
import { updateCalendarErrors } from './calendarErrorsHandler';
import { SlotAvailability } from '@wix/ambassador-availability-calendar/types';
import { ServiceType } from '@wix/bookings-uou-types';
import { GetActiveFeaturesResponse } from '@wix/ambassador-services-catalog-server/types';
import {
  DialogState,
  DialogType,
} from '../../ViewModel/dialogViewModel/dialogViewModel';
import { SetFocusedElement } from '../setFocusedElement/setFocusedElement';
import { FlowElements } from '../../Hooks/useFlow';
import { isWaitingListFlow } from '../../../../utils/waitingList/waitingList';
import { AddError } from '../addError/addError';
import { getSelectedSlots } from '../../../../utils/selectedSlots/selectedSlots';
import { CalendarErrors } from '../../../../types/types';
import { BOOKINGS_CALENDAR_REFERRAL_INFO } from '../../../../constants/constants';
import { getTrackingInfoForCalendarNextButtonClick } from '@wix/bookings-analytics-adapter';
import { RelatedPages } from '../../../../utils/bi/consts';
import { WixOOISDKAdapter } from '@wix/bookings-adapter-ooi-wix-sdk';

export const submitErrors: CalendarErrors[] = [
  CalendarErrors.NO_SELECTED_LOCATION_ERROR,
  CalendarErrors.NO_SELECTED_DURATION_ERROR,
  CalendarErrors.NO_SELECTED_STAFF_MEMBER_ERROR,
  CalendarErrors.NO_TIME_SELECTED_ERROR,
];

export type OnSubmit = () => void;

function isBookingsEnabled(
  serviceType: ServiceType,
  activeFeatures: GetActiveFeaturesResponse,
  wixSdkAdapter: WixOOISDKAdapter,
): boolean {
  if (wixSdkAdapter.isTemplateMode()) {
    return true;
  }

  switch (serviceType) {
    case ServiceType.GROUP:
      return !!activeFeatures.applicableForGroups;
    case ServiceType.INDIVIDUAL:
      return !!activeFeatures.applicableForIndividual;
    default:
      return true;
  }
}

export function createOnSubmitAction(
  actionFactoryParams: ActionFactoryParams<CalendarState, CalendarContext>,
  addError: AddError,
  setFocusedElement: SetFocusedElement,
): OnSubmit {
  return async () => {
    const { getControllerState, context } = actionFactoryParams;
    const [state, setState] = getControllerState();
    const {
      t,
      businessInfo,
      biLogger,
      wixSdkAdapter,
      activeFeatures,
    } = context;
    let {
      selectedTime,
      selectableSlotsAtSelectedTime,
      selectedBookingPreferences,
      calendarErrors,
      selectedService,
    } = state;
    const isBookingEnabled = isBookingsEnabled(
      selectedService!.info.type,
      activeFeatures!,
      wixSdkAdapter,
    );

    if (!selectedTime) {
      const calendarError = CalendarErrors.NO_TIME_SELECTED_ERROR;

      void biLogger.bookingsPaymentMethodSelectionNextClicked({
        userMessage: calendarError,
      });
      addError(calendarError);
      setFocusedElement(FlowElements.BOTTOM_SECTION);
    }

    if (selectableSlotsAtSelectedTime) {
      const bookingPreferences = getBookingPreferencesForSelectedTime({
        selectableSlotsAtSelectedTime,
        calendarErrors,
        selectedBookingPreferences,
        context,
      });

      updateCalendarErrors(
        bookingPreferences,
        addError,
        selectedBookingPreferences,
      );

      [{ calendarErrors }] = getControllerState();

      const isCalendarErrorsHasSubmitErrors = calendarErrors.some((error) =>
        submitErrors.includes(error),
      );

      const dateRegionalSettingsLocale = businessInfo!
        .dateRegionalSettingsLocale!;
      const selectedSlots = getSelectedSlots({
        selectableSlotsAtSelectedTime,
        dateRegionalSettingsLocale,
        t,
        selectedBookingPreferences,
      });
      const isWaitingList = isWaitingListFlow({
        selectableSlots: selectableSlotsAtSelectedTime,
        selectedBookingPreferences,
        bookingPreferences,
      });

      if (!isCalendarErrorsHasSubmitErrors && selectedSlots.length > 0) {
        const isBookingFormInstalled = await wixSdkAdapter.isBookingFormInstalled();
        if (wixSdkAdapter.isPreviewMode()) {
          if (!isBookingEnabled) {
            await wixSdkAdapter.openPreviewPremiumModal(
              selectedService!.info.type,
              BOOKINGS_CALENDAR_REFERRAL_INFO,
            );
          }
          return goToNextPage(
            actionFactoryParams,
            selectedSlots,
            isWaitingList,
            isBookingFormInstalled,
          );
        }
        if (wixSdkAdapter.isSiteMode()) {
          if (isBookingEnabled) {
            return goToNextPage(
              actionFactoryParams,
              selectedSlots,
              isWaitingList,
              isBookingFormInstalled,
            );
          } else {
            setState({
              dialog: {
                type: DialogType.PremiumViewer,
                state: DialogState.IDLE,
              },
            });
          }
        }
      } else {
        void biLogger.bookingsPaymentMethodSelectionNextClicked({
          selectedSlot: selectedTime,
          ...getBiProperties({ isWaitingList }),
        });
      }
    }
  };
}

export async function goToNextPage(
  actionFactoryParams: ActionFactoryParams<CalendarState, CalendarContext>,
  selectedSlots: SlotAvailability[],
  isWaitingList: boolean,
  isBookingFormInstalled: boolean,
) {
  const {
    getControllerState,
    context: { biLogger, wixSdkAdapter, businessInfo, experiments },
  } = actionFactoryParams;
  const [state, setState] = getControllerState();
  const { selectedTime, selectedService, selectedTimezone } = state;
  const isRescheduling = !!state.rescheduleBookingDetails;
  void biLogger.bookingsContactInfoSaveSuccess({
    selectedSlot: selectedTime,
    ...getBiProperties({ isWaitingList, isBookingFormInstalled }),
  });

  if (isRescheduling) {
    setState({
      dialog: {
        type: DialogType.RescheduleConfirm,
        state: DialogState.IDLE,
      },
    });
  } else if (isWaitingList) {
    setState({
      dialog: {
        type: DialogType.JoinWaitlist,
        state: DialogState.IDLE,
      },
    });
  } else {
    const slotAvailability = selectedSlots[0];
    const serviceId = selectedService!.id;
    const serviceSlug = selectedService!.info.slug;
    await wixSdkAdapter.navigateToBookingsFormPage({
      slotAvailability,
      serviceId,
      serviceSlug,
      referral: BOOKINGS_CALENDAR_REFERRAL_INFO,
      timezone: selectedTimezone,
    });

    const isAnalyticsOOIEnabled = experiments.enabled(
      'specs.bookings.analyticsOOI',
    );
    if (isAnalyticsOOIEnabled && selectedService) {
      const trackingInfo = getTrackingInfoForCalendarNextButtonClick({
        services: [selectedService],
        businessName: businessInfo?.name || '',
      });
      wixSdkAdapter.trackAnalytics(trackingInfo);
    }
  }
}

const getBiProperties = ({
  isWaitingList,
  isBookingFormInstalled,
}: {
  isWaitingList: boolean;
  isBookingFormInstalled?: boolean;
}) => {
  if (isWaitingList) {
    return { properties: JSON.stringify({ waitlist: true }) };
  } else if (isBookingFormInstalled) {
    return { target: RelatedPages.BookingForm };
  }
  return {};
};
