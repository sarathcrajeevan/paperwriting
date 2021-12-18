import { Booking } from '@wix/ambassador-bookings-server/types';
import { ControllerParams, CreateControllerFn } from '@wix/yoshi-flow-editor';
import { createControlledComponent } from '../../utils/ControlledComponent/ControlledComponent';
import {
  CalendarViewModel,
  createMemoizedCalendarViewModelFactory,
} from './ViewModel/viewModel';
import { CalendarActions, createCalendarActions } from './Actions/actions';
import { Service } from '@wix/bookings-uou-types';
import {
  CalendarContext,
  createCalendarContext,
} from '../../utils/context/contextFactory';
import { CalendarApi } from '../../api/CalendarApi';
import { createWixSdkAdapter } from '../../utils/sdkAdapterFactory';
import { createInitialState } from '../../utils/state/initialStateFactory';
import { BottomSectionStatus } from './ViewModel/widgetViewModel/widgetViewModel';
import {
  QueryAvailabilityResponse,
  SlotAvailability,
} from '@wix/ambassador-availability-calendar/types';
import {
  DialogState,
  DialogType,
} from './ViewModel/dialogViewModel/dialogViewModel';
import { SelectedBookingPreference } from '../../utils/bookingPreferences/bookingPreferences';
import { FlowElements } from './Hooks/useFlow';
import { EmptyStateType } from './ViewModel/emptyStateViewModel/emptyStateViewModel';
import {
  CalendarErrors,
  FilterOptions,
  SlotsStatus,
  TriggeredByOptions,
} from '../../types/types';
import { navigateToServicePageIfNeeded } from '../../utils/navigation/navigation';
import { ITEM_TYPES } from '@wix/advanced-seo-utils/api';
import { Plan } from '@wix/ambassador-checkout-server/types';
import { BookingsQueryParams } from '@wix/bookings-adapter-ooi-wix-sdk';

export type TFunction = (
  key: string | string[],
  options?: Record<string, any>,
  defaultValue?: string,
) => string;

export type CalendarState = {
  bottomSectionStatus: BottomSectionStatus;
  slotsStatus: SlotsStatus;
  selectedService: Service | undefined;
  selectedDate?: string;
  selectedDateTrigger?: TriggeredByOptions;
  selectedTimezone?: string;
  selectedRange?: {
    from: string;
    to: string;
  };
  selectedTime?: string;
  selectableSlotsAtSelectedTime?: SlotAvailability[];
  availableSlots?: QueryAvailabilityResponse;
  availableSlotsPerDay?: QueryAvailabilityResponse;
  selectedBookingPreferences: SelectedBookingPreference[];
  calendarErrors: CalendarErrors[];
  rescheduleBookingDetails?: Booking;
  dialog?: {
    type: DialogType;
    state: DialogState;
  };
  filterOptions: FilterOptions;
  focusedElement?: FlowElements;
  initialErrors: EmptyStateType[];
  purchasedPricingPlans: Plan[];
  isUserLoggedIn: boolean;
};

// For more info about controller structure,
// check the docs: https://bo.wix.com/pages/yoshi/docs/editor-flow/structure-api/component#controller
const createController: CreateControllerFn = async ({
  flowAPI,
}: ControllerParams) => {
  let rerender: () => Promise<void> = async () => {};
  const { controllerConfig } = flowAPI;
  const wixSdkAdapter = createWixSdkAdapter(controllerConfig);
  let service: Service;
  return {
    async pageReady() {
      const { controllerConfig, reportError } = flowAPI;
      const calendarApi = new CalendarApi({
        wixSdkAdapter,
        reportError,
        flowAPI,
      });

      const initialErrors: EmptyStateType[] = [];

      const onError = (type: EmptyStateType) => initialErrors.push(type);
      const isAnonymousCancellationFlow =
        wixSdkAdapter.getUrlQueryParamValue(BookingsQueryParams.REFERRAL) ===
        'batel';

      const isShowPricingPlanEndDateIndicationEnabled = flowAPI.experiments.enabled(
        'specs.bookings.ShowPricingPlanEndDateIndication',
      );
      const currentUser = controllerConfig.wixCodeApi.user.currentUser;
      const shouldGetPurchaserPricingPlans =
        isShowPricingPlanEndDateIndicationEnabled && currentUser.loggedIn;
      const [
        catalogData,
        rescheduleBookingDetails,
        allPurchasedPricingPlans,
        isPricingPlanInstalled,
        isMemberAreaInstalled,
      ] = await Promise.all([
        calendarApi.getCatalogData({ onError }),
        calendarApi.getBookingDetails({
          onError: (type: EmptyStateType) => {
            if (!isAnonymousCancellationFlow) {
              onError(type);
            }
          },
        }),
        shouldGetPurchaserPricingPlans
          ? calendarApi.getPurchasedPricingPlans({ contactId: currentUser.id })
          : [],
        wixSdkAdapter.isPricingPlanInstalled().catch(() => false),
        wixSdkAdapter.isMemberAreaInstalled().catch(() => false),
      ]);
      const selectedService = catalogData?.services?.[0];
      service = selectedService!;
      if (selectedService) {
        await navigateToServicePageIfNeeded(selectedService, wixSdkAdapter);
      }

      const initialState: CalendarState = createInitialState({
        service: selectedService,
        staffMembers: catalogData?.staffMembers,
        wixSdkAdapter,
        rescheduleBookingDetails,
        initialErrors,
        isAnonymousCancellationFlow,
        allPurchasedPricingPlans,
        isShowPricingPlanEndDateIndicationEnabled,
        isPricingPlanInstalled,
        isUserLoggedIn: currentUser.loggedIn,
      });

      const calendarContext: CalendarContext = createCalendarContext({
        flowAPI,
        businessInfo: catalogData?.businessInfo,
        activeFeatures: catalogData?.activeFeatures,
        calendarApi,
        wixSdkAdapter,
        initialState,
        isPricingPlanInstalled,
        isMemberAreaInstalled,
      });

      const {
        onStateChange,
        render,
        controllerActions,
        setState,
      } = await createControlledComponent<
        CalendarState,
        CalendarActions,
        CalendarViewModel,
        CalendarContext
      >({
        controllerConfig,
        initialState,
        viewModelFactory: createMemoizedCalendarViewModelFactory(
          wixSdkAdapter.isEditorMode(),
        ),
        actionsFactory: createCalendarActions,
        context: calendarContext,
      });
      rerender = render;
      if (
        isAnonymousCancellationFlow &&
        !controllerConfig.wixCodeApi.user.currentUser.loggedIn &&
        !wixSdkAdapter.isSSR() &&
        // @ts-expect-error
        wixSdkAdapter.getUrlQueryParamValue('bookingId')
      ) {
        setTimeout(async () => {
          try {
            // @ts-expect-error
            await controllerConfig.wixCodeApi.user.promptLogin();
          } catch (e) {
            //
          }

          const rescheduleBookingDetails = await calendarApi.getBookingDetails({
            onError,
          });
          setState({ rescheduleBookingDetails });
        }, 10);
      }

      await wixSdkAdapter.renderSeoTags(
        ITEM_TYPES.BOOKINGS_CALENDAR,
        catalogData?.seoData?.[0],
      );

      const { biLogger } = calendarContext;

      if (!wixSdkAdapter.isSSR()) {
        onStateChange((state) => {
          biLogger.update(state);
        });
      }

      if (isShowPricingPlanEndDateIndicationEnabled) {
        wixSdkAdapter.onUserLogin(controllerActions.onUserLoggedIn);
      }
      if (!selectedService) {
        void biLogger.bookingsCalendarErrorMessages({
          errorMessage: 'SERVICE_NOT_FOUND',
        });
      }
    },
    exports() {
      return {
        onNextClicked(overrideCallback: Function) {
          wixSdkAdapter.navigateToBookingsFormPage = ({ slotAvailability }) =>
            overrideCallback({
              service,
              slotAvailability,
            });
        },
      };
    },
    updateConfig() {
      rerender();
    },
  };
};

export default createController;
