import { ViewModelFactoryParams } from '../../../../utils/ControlledComponent/ControlledComponent.types';
import { WixOOISDKAdapter } from '@wix/bookings-adapter-ooi-wix-sdk';
import {
  OfferedAsType,
  ServicePayment,
  ServicePaymentDto,
} from '@wix/bookings-uou-types';
import {
  PaymentDtoMapper,
  isServiceOfferedAsPricingPlan,
} from '@wix/bookings-uou-mappers';
import {
  formatRfcTimeStringToDateAndTimeView,
  getDateTimeFromLocalDateTime,
} from '../../../../utils/dateAndTime/dateAndTime';
import { getBookingPreferencesForSelectedTime } from '../../../../utils/bookingPreferences/bookingPreferencesForSelectedTime';
import {
  CalendarContext,
  GetContent,
} from '../../../../utils/context/contextFactory';
import { CalendarState, TFunction } from '../../controller';
import settingsParams from '../../settingsParams';
import {
  BookingPreference,
  BookingPreferenceOption,
} from '../../../../utils/bookingPreferences/bookingPreferences';
import { isWaitingListFlow } from '../../../../utils/waitingList/waitingList';
import { MemoizedViewModalFactory } from '../viewModel';
import { CalendarErrors, Preference } from '../../../../types/types';
import { getFurthestValidUntilPlan } from '../../../../utils/pricingPlans/pricingPlans';

export const PRICE_DESCRIPTION_DELIMITER = ' | ';

export type BookingDetailsPreferences = {
  bookingPreferences: BookingPreference[];
  titleText: string;
  clearText: string;
};

export type BookingDetailsViewModel = {
  serviceName: string;
  dateAndTime?: string;
  paymentDescription?: string;
  videoConferenceBadgeText?: string;
  preferences: BookingDetailsPreferences;
  ctaText: string;
  ctaFullWidth: boolean;
  disableCTAButton: boolean;
  alert?: string;
};

export const memoizedBookingDetailsViewModel: MemoizedViewModalFactory<BookingDetailsViewModel> = {
  dependencies: {
    state: [
      'selectedService',
      'selectableSlotsAtSelectedTime',
      'selectedTime',
      'selectedBookingPreferences',
      'calendarErrors',
      'rescheduleBookingDetails',
      'purchasedPricingPlans',
    ],
    settings: [
      'videoConferenceBadgeVisibility',
      'videoConferenceBadge',
      'bookingDetailsPricingPlanText',
      'waitlistIndication',
      'bookingDetailsClearText',
      'preferencesTitle',
      'buttonsFullWidth',
      'nextButton',
      'rescheduleButton',
      'pendingApprovalButton',
      'joinWaitlistButton',
      'locationLabel',
      'staffMemberLabel',
      'durationLabel',
    ],
  },
  createViewModel: createBookingDetailsViewModel,
};

const getVideoConferencingBadge = (getContent: GetContent) =>
  getContent({
    settingsParam: settingsParams.videoConferenceBadge,
    translationKey: 'app.settings.defaults.video-conference-badge-text',
  });

export function createBookingDetailsViewModel({
  state,
  context,
}: ViewModelFactoryParams<
  CalendarState,
  CalendarContext
>): BookingDetailsViewModel {
  const {
    businessInfo,
    t,
    settings,
    wixSdkAdapter,
    getContent,
    experiments,
  } = context;
  const regionalSettingsLocale = businessInfo!.regionalSettingsLocale!;
  const dateRegionalSettingsLocale = businessInfo!.dateRegionalSettingsLocale!;
  const {
    selectedService,
    selectableSlotsAtSelectedTime,
    selectedTime,
    selectedBookingPreferences,
    calendarErrors,
    purchasedPricingPlans,
  } = state;

  const isShowPricingPlanEndDateIndicationEnabled = experiments.enabled(
    'specs.bookings.ShowPricingPlanEndDateIndication',
  );

  const disableCTAButton = calendarErrors.some(
    (error) =>
      error === CalendarErrors.NO_NEXT_AVAILABLE_DATE_WARNING ||
      (isShowPricingPlanEndDateIndicationEnabled &&
        error ===
          CalendarErrors.NO_VALID_PRICING_PLAN_IN_RESCHEDULE_FLOW_ERROR),
  );
  const serviceName = selectedService!.info.name;

  let alert;
  if (isShowPricingPlanEndDateIndicationEnabled) {
    if (calendarErrors.includes(CalendarErrors.NO_VALID_PRICING_PLAN_WARNING)) {
      const furthestValidUntilPlan = getFurthestValidUntilPlan(
        purchasedPricingPlans,
      );
      alert = furthestValidUntilPlan
        ? t('app.booking-details.pricing-plan-alert', {
            planName: furthestValidUntilPlan.planName,
            planDate: getDateTimeFromLocalDateTime(
              furthestValidUntilPlan.validUntil!,
            ),
          })
        : undefined;
    }
  }
  const shouldShowVideoConferenceBadge = settings.get(
    settingsParams.videoConferenceBadgeVisibility,
  );
  const videoConferenceBadgeText =
    shouldShowVideoConferenceBadge && selectedService!.videoConferenceProviderId
      ? getVideoConferencingBadge(getContent)
      : '';

  const paymentDescription = getPaymentDescription({
    wixSdkAdapter,
    payment: selectedService!.payment,
    regionalSettingsLocale,
    bookingDetailsPricingPlanText: settings.get(
      settingsParams.bookingDetailsPricingPlanText,
    ),
    context,
  });

  const dateAndTime = selectedTime
    ? formatRfcTimeStringToDateAndTimeView(
        selectedTime,
        dateRegionalSettingsLocale,
      )
    : '';
  const bookingPreferences = getBookingPreferencesForSelectedTime({
    selectableSlotsAtSelectedTime: selectableSlotsAtSelectedTime ?? [],
    selectedBookingPreferences,
    calendarErrors,
    context,
  });

  const ctaText = getCtaText({ state, bookingPreferences, getContent });

  return {
    serviceName,
    paymentDescription,
    dateAndTime,
    videoConferenceBadgeText,
    preferences: {
      bookingPreferences: getBookingPreferencesOptionsWithEnrichedValue({
        bookingPreferences,
        waitlistIndicationText: getContent({
          settingsParam: settingsParams.waitlistIndication,
          translationKey: 'app.settings.defaults.waitlist',
        }),
        t,
      }),
      clearText: settings.get(settingsParams.bookingDetailsClearText),
      titleText: getContent({
        settingsParam: settingsParams.preferencesTitle,
        translationKey:
          'app.settings.defaults.booking-details.preferences.title',
      }),
    },
    ctaText,
    disableCTAButton,
    ctaFullWidth: settings.get(settingsParams.buttonsFullWidth),
    ...(isShowPricingPlanEndDateIndicationEnabled ? { alert } : {}),
  };
}

export function createDummyBookingDetailsViewModel({
  context,
}: ViewModelFactoryParams<
  CalendarState,
  CalendarContext
>): BookingDetailsViewModel {
  const { t, settings, getContent } = context;
  return {
    videoConferenceBadgeText: settings.get(
      settingsParams.videoConferenceBadgeVisibility,
    )
      ? getVideoConferencingBadge(getContent)
      : '',
    serviceName: t('dummy-content.service.name'),
    paymentDescription: t('dummy-content.service.price'),
    ctaText: getContent({
      settingsParam: settingsParams.nextButton,
      translationKey: 'app.settings.defaults.booking-details.book-now.text',
    }),
    disableCTAButton: false,
    ctaFullWidth: settings.get(settingsParams.buttonsFullWidth),
    preferences: {
      bookingPreferences: [
        {
          error: {
            key: CalendarErrors.NO_SELECTED_DURATION_ERROR,
            message: '',
          },
          key: Preference.DURATION,
          placeholder: '',
          options: [
            {
              value: getContent({
                settingsParam: settingsParams.durationLabel,
                translationKey: 'dummy-content.service.duration',
              }),
            },
          ],
        },
        {
          error: {
            key: CalendarErrors.NO_SELECTED_STAFF_MEMBER_ERROR,
            message: '',
          },
          key: Preference.STAFF_MEMBER,
          placeholder: '',
          options: [
            {
              value: getContent({
                settingsParam: settingsParams.staffMemberLabel,
                translationKey: 'dummy-content.service.staff',
              }),
            },
          ],
        },
        {
          error: {
            key: CalendarErrors.NO_SELECTED_LOCATION_ERROR,
            message: '',
          },
          key: Preference.LOCATION,
          placeholder: '',
          options: [
            {
              value: getContent({
                settingsParam: settingsParams.locationLabel,
                translationKey: 'dummy-content.service.location',
              }),
            },
          ],
        },
      ],
      clearText: settings.get(settingsParams.bookingDetailsClearText),
      titleText: getContent({
        settingsParam: settingsParams.preferencesTitle,
        translationKey:
          'app.settings.defaults.booking-details.preferences.title',
      }),
    },
  };
}

const getCtaText = ({
  state,
  bookingPreferences,
  getContent,
}: {
  state: CalendarState;
  getContent: GetContent;
  bookingPreferences: BookingPreference[];
}): string => {
  const { selectableSlotsAtSelectedTime, selectedBookingPreferences } = state;
  const isRescheduling = isReschedulingFlow(state);
  const isPendingApproval = isPendingApprovalFlow(state);
  const isWaitingList = isWaitingListFlow({
    selectableSlots: selectableSlotsAtSelectedTime,
    selectedBookingPreferences,
    bookingPreferences,
  });
  if (isRescheduling) {
    return getContent({
      settingsParam: settingsParams.rescheduleButton,
      translationKey: 'app.rescheduled-booking.booking-details.cta',
    });
  }
  if (isPendingApproval) {
    return getContent({
      settingsParam: settingsParams.pendingApprovalButton,
      translationKey:
        'app.settings.defaults.booking-details.pending-approval.text',
    });
  }
  if (isWaitingList) {
    return getContent({
      settingsParam: settingsParams.joinWaitlistButton,
      translationKey:
        'app.settings.defaults.booking-details.join-waitlist.text',
    });
  }
  return getContent({
    settingsParam: settingsParams.nextButton,
    translationKey: 'app.settings.defaults.booking-details.book-now.text',
  });
};

const isReschedulingFlow = (state: CalendarState) =>
  !!state.rescheduleBookingDetails;

const isPendingApprovalFlow = (state: CalendarState) =>
  !!state.selectedService!.policy?.isPendingApprovalFlow;

const getPaymentDescription = ({
  wixSdkAdapter,
  payment,
  regionalSettingsLocale,
  bookingDetailsPricingPlanText,
  context,
}: {
  wixSdkAdapter: WixOOISDKAdapter;
  payment: ServicePayment;
  regionalSettingsLocale: string;
  bookingDetailsPricingPlanText: string;
  context: CalendarContext;
}) => {
  const paymentDescription = [];

  const isServiceBookableWithPricingPlan = context.isPricingPlanInstalled;
  if (isOfferedAsOneTime(payment)) {
    const priceText = getPriceText(payment, regionalSettingsLocale);
    paymentDescription.push(priceText);
  }
  if (
    isServiceOfferedAsPricingPlan(payment, isServiceBookableWithPricingPlan)
  ) {
    paymentDescription.push(bookingDetailsPricingPlanText);
  }
  return (
    paymentDescription
      // remove empty items
      .filter((priceItem) => !!priceItem.trim())
      .join(PRICE_DESCRIPTION_DELIMITER)
  );
};

const isOfferedAsOneTime = (payment: ServicePayment) => {
  return payment.offeredAs.indexOf(OfferedAsType.ONE_TIME) >= 0;
};

const getPriceText = (
  payment: ServicePayment,
  dateRegionalSettingsLocale: string,
) => {
  const paymentDto: ServicePaymentDto = payment.paymentDetails;
  const paymentDtoMapper = new PaymentDtoMapper(dateRegionalSettingsLocale);
  return paymentDtoMapper.priceText(paymentDto);
};

const getBookingPreferencesOptionsWithEnrichedValue = ({
  bookingPreferences,
  waitlistIndicationText,
  t,
}: {
  bookingPreferences: BookingPreference[];
  waitlistIndicationText: string;
  t: TFunction;
}): BookingPreference[] => {
  return bookingPreferences.map((bookingPreference: BookingPreference) => {
    let options: BookingPreferenceOption[];
    if (bookingPreference.options.length > 1) {
      options = bookingPreference.options.map(
        (bookingPreferenceOption: BookingPreferenceOption) => {
          const valueWithWaitlistOnlyIndication = t(
            'app.booking-details.dropdowns.option-with-waitlist-only',
            {
              option: bookingPreferenceOption.value,
              waitlistOnly: waitlistIndicationText,
            },
          );
          return {
            ...bookingPreferenceOption,
            value: bookingPreferenceOption.isWithWaitingList
              ? valueWithWaitlistOnlyIndication
              : bookingPreferenceOption.value,
          };
        },
      );
    } else {
      options = bookingPreference.options;
    }

    return {
      ...bookingPreference,
      options,
    };
  });
};
