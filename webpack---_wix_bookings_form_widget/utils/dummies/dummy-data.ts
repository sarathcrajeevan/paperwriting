import { ControllerFlowAPI } from '@wix/yoshi-flow-editor';
import { SlotAvailability } from '@wix/ambassador-availability-calendar/types';
import { GetActiveFeaturesResponse } from '@wix/ambassador-services-catalog-server/types';
import {
  OfferedAsType,
  ServiceLocationType,
  ServiceType,
  TimezoneType,
  PaymentType as UoUPaymentType,
} from '@wix/bookings-uou-types';
import { Service } from '../mappers/service.mapper';
import {
  FormFieldViewInfoFieldType,
  FormViewField,
  ValidationProperties,
} from '@wix/forms-ui/types';
import { BookingRequestKeyMappings } from '../mappers/form-submission.mapper';
import { FormState } from '../state/initialStateFactory';
import { BusinessInfo, FieldLayout, TFunction } from '../../types/types';
import { mockEditorContext } from '../../../__tests__/mocks/mockEditorContext';
import { getDefaultPaymentOptionId } from '../payment/payment';
import { FormStatus } from '../../types/form-state';
import { SelectedPaymentOption } from '@wix/ambassador-gateway/types';

enum DummyFieldIds {
  FULL_NAME = 'dummy-full-name-field',
  FIRST_NAME = 'dummy-first-name-field',
  LAST_NAME = 'dummy-last-name-field',
  EMAIL = 'dummy-email-field',
  PHONE = 'dummy-phone-field',
  MESSAGE = 'dummy-message-field',
}

export function createDummyState({
  flowApi,
  businessInfo,
  isPricingPlanInstalled,
  isMemberAreaInstalled,
  isBookingsOnEcom,
}: {
  flowApi: ControllerFlowAPI;
  businessInfo: BusinessInfo;
  isPricingPlanInstalled: boolean;
  isMemberAreaInstalled: boolean;
  isBookingsOnEcom: boolean;
}): FormState {
  const pricingPlanDetails = { plans: [] };
  const service = createDummyService(
    flowApi,
    businessInfo,
    isPricingPlanInstalled,
  );
  return {
    service,
    businessInfo,
    activeFeatures: createDummyActiveFeatures(),
    slotAvailability: createDummySlotAvailability(),
    pricingPlanDetails,
    selectedPaymentOptionId: getDefaultPaymentOptionId({
      settings: flowApi.settings,
      servicePayment: service.payment,
      pricingPlanDetails,
      isPricingPlanInstalled,
    }),
    memberDetails: undefined,
    errors: [],
    couponInfo: {
      areCouponsAvailable: false,
      isCouponInputDisplayed: false,
    },
    paymentDetails: {
      currency: businessInfo?.currency || 'USD',
      price: 10,
      totalPrice: 10,
      priceText: '',
      minCharge: 0,
      isFree: false,
      paymentType: (SelectedPaymentOption.OFFLINE as unknown) as UoUPaymentType,
    },
    isPricingPlanInstalled,
    isMemberAreaInstalled,
    editorContext: mockEditorContext({
      isDummy: true,
    }),
    status: FormStatus.IDLE,
    formInputs: {
      numberOfParticipants: 1,
    },
    selectedPaymentType: SelectedPaymentOption.ONLINE,
    isBookingsOnEcom,
  };
}

function createDummyService(
  flowApi: ControllerFlowAPI,
  businessInfo: BusinessInfo,
  isPricingPlanInstalled: boolean,
): Service {
  const { t } = flowApi.translations;
  return ({
    name: t('app.dummy-data.service'),
    staffMembers: [
      {
        id: 'dummy-staff-id',
        name: t('app.dummy-data.staff'),
      },
    ],
    // rate: Rate;
    location: {
      id: 'dummy-location-id',
      locationType: ServiceLocationType.OWNER_CUSTOM,
      address: t('app.dummy-data.location'),
    },
    isPendingApprovalFlow: false,
    isWaitingListFlow: false,
    videoConferenceProviderId: 'some-video-provider',
    paymentTypes: [SelectedPaymentOption.OFFLINE, SelectedPaymentOption.ONLINE],
    type: ServiceType.INDIVIDUAL,
    scheduleId: 'dummy-schedule-id',
    formSchema: {
      fields: [
        createDummyFormField({
          id: DummyFieldIds.FULL_NAME,
          label: t('app.dummy-data.field.full-name'),
          type: FormFieldViewInfoFieldType.TEXT,
          layout: FieldLayout.SHORT,
          validationProperties: {
            required: true,
          },
        }),
        createDummyFormField({
          id: DummyFieldIds.EMAIL,
          label: t('app.dummy-data.field.email'),
          type: FormFieldViewInfoFieldType.EMAIL,
          layout: FieldLayout.SHORT,
          validationProperties: {
            required: true,
          },
        }),
        createDummyFormField({
          id: DummyFieldIds.PHONE,
          label: t('app.dummy-data.field.phone'),
          type: FormFieldViewInfoFieldType.PHONE,
          layout: FieldLayout.SHORT,
        }),
        createDummyFormField({
          id: DummyFieldIds.MESSAGE,
          label: t('app.dummy-data.field.add-message'),
          type: FormFieldViewInfoFieldType.PARAGRAPH,
        }),
      ],
    },
    formHeader: {
      title: t('app.dummy-data.header.title'),
      description: t('app.dummy-data.header.description'),
      isDescriptionHidden: false,
    },
    payment: {
      offeredAs: [
        OfferedAsType.ONE_TIME,
        ...(isPricingPlanInstalled ? [OfferedAsType.PRICING_PLAN] : []),
      ],
      paymentDetails: {
        currency: businessInfo.currency,
        isFree: false,
        paymentType: SelectedPaymentOption.ONLINE,
      },
      pricingPlanInfo: {
        pricingPlans: [
          {
            id: 'dummy-pricing-plan',
            name: 'Pricing Plan',
          },
        ],
      },
    },
    actionLabels: {
      onlinePaymentLabel: t('app.dummy-data.button'),
    },
  } as unknown) as Service;
}

export function createDummySubmission(t: TFunction) {
  return {
    [DummyFieldIds.FULL_NAME]: {
      value: t('app.dummy-data.field.full-name.place-holder'),
    },
    [DummyFieldIds.FIRST_NAME]: {
      value: t('app.dummy-data.field.first-name.place-holder'),
    },
    [DummyFieldIds.LAST_NAME]: {
      value: t('app.dummy-data.field.last-name.place-holder'),
    },
    [DummyFieldIds.PHONE]: {
      value: t('app.dummy-data.field.phone.place-holder'),
    },
    [DummyFieldIds.EMAIL]: {
      value: t('app.dummy-data.field.email.place-holder'),
    },
  };
}

export function createDummyEmptySubmission() {
  return {
    [DummyFieldIds.FIRST_NAME]: { value: '' },
    [DummyFieldIds.LAST_NAME]: { value: '' },
    [DummyFieldIds.EMAIL]: { value: '' },
  };
}

export function createDummyBusinessInfo(flowApi: ControllerFlowAPI) {
  const { config } = flowApi.translations;
  return {
    language: config.language,
    currency: 'USD',
    timeZone: 'Asia/Jerusalem',
    timezoneProperties: {
      defaultTimezone: TimezoneType.BUSINESS,
      clientCanChooseTimezone: true,
    },
    regionalSettingsLocale: 'en-US',
  };
}

function createDummyActiveFeatures(): GetActiveFeaturesResponse {
  return {
    applicableForCourse: true,
    applicableForGroups: true,
    applicableForIndividual: true,
    applicableForPayments: true,
    applicableForReminders: true,
    applicableForServiceList: true,
    applicableForSmsReminders: true,
    bookingsStaffLimit: 100,
  };
}

function createDummySlotAvailability(): SlotAvailability {
  return {
    slot: {},
  } as SlotAvailability;
}

function createDummyFormField({
  id,
  label,
  bookingsKey,
  type,
  layout,
  validationProperties,
}: {
  id: string;
  label: string;
  type: FormFieldViewInfoFieldType;
  layout?: FieldLayout;
  bookingsKey?: BookingRequestKeyMappings;
  validationProperties?: ValidationProperties;
}): FormViewField {
  return {
    externalId: id,
    renderInfo: {
      type,
      displayProperties: {
        label,
      },
      metadata: {
        ...(bookingsKey ? { bookingsKey } : {}),
        ...(layout
          ? {
              layout: { appearance: layout },
            }
          : {}),
      },
      ...(validationProperties
        ? {
            validationProperties,
          }
        : {}),
    },
  };
}
