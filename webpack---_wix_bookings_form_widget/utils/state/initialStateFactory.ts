import { PaidPlans } from '@wix/ambassador-checkout-server/types';
import { Member } from '@wix/ambassador-members-ng-api/types';
import { ControllerFlowAPI } from '@wix/yoshi-flow-editor';
import settingsParams from '../../components/BookingsForm/settingsParams';
import {
  BusinessInfo,
  Dialog,
  ServicePaymentDetails,
  SettingsSubTab,
  SettingsTab,
  TFunction,
} from '../../types/types';
import {
  getActiveSchedule,
  getServiceType,
  mapCatalogServiceToService,
  Service,
} from '../mappers/service.mapper';
import { ServiceType } from '@wix/bookings-uou-types';
import { GetActiveFeaturesResponse } from '@wix/ambassador-services-catalog-server/types';
import { SlotAvailability } from '@wix/ambassador-availability-calendar/types';
import { FormApi } from '../../api/FormApi';
import { IWidgetControllerConfig } from '@wix/native-components-infra/dist/src/types/types';
import {
  BookingsQueryParams,
  WixOOISDKAdapter,
} from '@wix/bookings-adapter-ooi-wix-sdk';
import { createDummyState } from '../dummies/dummy-data';
import {
  getDefaultPaymentOptionId,
  getFirstAvailablePaymentOptionId,
  isOfferedAsPricingPlanOnly,
} from '../payment/payment';
import { FormView, Submission } from '@wix/forms-ui/types';
import { getSessionValues } from '../storageFunctions';
import { EmptyStateErrorType, FormErrors } from '../../types/errors';
import { getErrorByType } from '../errors/errors';
import { CouponInfo } from '../../types/coupons';
import {
  BookingRequestKeyMappings,
  getFieldFromSchema,
} from '../mappers/form-submission.mapper';
import { mapServicePaymentDto } from '@wix/bookings-uou-mappers';
import { FormStatus } from '../../types/form-state';
import { SelectedPaymentOption } from '@wix/ambassador-gateway/types';
import { getCurrentTimezone } from '../timezone/timezone';

export type EditorContext = {
  isDummy: boolean;
  selectedSettingsTabId?: SettingsTab;
  selectedSettingsSubTabId?: SettingsSubTab;
};

export type FormState = {
  service: Service;
  isPricingPlanInstalled: boolean;
  isMemberAreaInstalled: boolean;
  couponInfo: CouponInfo;
  businessInfo: BusinessInfo;
  activeFeatures: GetActiveFeaturesResponse;
  slotAvailability: SlotAvailability;
  pricingPlanDetails?: PaidPlans;
  memberDetails?: Member;
  errors: FormErrors[];
  selectedPaymentOptionId: string;
  editorContext: EditorContext;
  status: FormStatus;
  overrideDefaultFieldsValues?: boolean;
  dialog?: Dialog;
  paymentDetails: ServicePaymentDetails;
  formInputs: FormInputs;
  selectedPaymentType: SelectedPaymentOption;
  isBookingsOnEcom: boolean;
};

export type FormInputs = {
  numberOfParticipants: number;
  email?: string;
};

export async function createInitialState({
  t,
  flowApi,
  wixSdkAdapter,
  formApi,
}: {
  t: TFunction;
  flowApi: ControllerFlowAPI;
  wixSdkAdapter: WixOOISDKAdapter;
  formApi: FormApi;
}): Promise<FormState> {
  const { settings, controllerConfig } = flowApi;

  if (wixSdkAdapter.isSSR()) {
    return {
      status: FormStatus.SSR,
    } as FormState;
  }

  const serviceId = getSessionValues(
    wixSdkAdapter,
    BookingsQueryParams.SERVICE_ID,
  );

  if (
    wixSdkAdapter.isEditorMode() ||
    (wixSdkAdapter.isPreviewMode() && !serviceId)
  ) {
    const [
      catalogData,
      isPricingPlanInstalled,
      isMemberAreaInstalled,
      isBookingsOnEcom,
    ] = await Promise.all([
      formApi.getCatalogData(),
      wixSdkAdapter.isPricingPlanInstalled().catch(() => false),
      wixSdkAdapter.isMemberAreaInstalled().catch(() => false),
      wixSdkAdapter.isBookingsOnEcom().catch(() => false),
    ]);
    return createDummyState({
      flowApi,
      businessInfo: catalogData.businessInfo,
      isMemberAreaInstalled,
      isPricingPlanInstalled,
      isBookingsOnEcom,
    });
  }

  try {
    const {
      areCouponsAvailable,
      catalogData,
      listSlots,
      memberDetails,
      slotAvailability,
      pricingPlanDetails,
      isPricingPlanInstalled,
      isMemberAreaInstalled,
      errors,
    } = await fetchInitialData({
      formApi,
      controllerConfig,
      wixSdkAdapter,
      serviceId,
    });

    const emptyStateError = getErrorByType({
      errorType: EmptyStateErrorType,
      errors,
    });

    if (emptyStateError) {
      throw emptyStateError;
    }

    const preFilledValues: Maybe<Submission> = getSessionValues(
      wixSdkAdapter,
      BookingsQueryParams.FILLED_FIELDS,
    );
    const service = mapCatalogServiceToService({
      catalogData: catalogData!,
      slotAvailability: slotAvailability!,
      pricingPlanDetails,
      preFilledValues,
      t,
      listSlots,
      serviceId,
      isNameFieldDeprecationEnabled: flowApi.experiments.enabled(
        'specs.bookings.UoUFormNameDeprecation',
      ),
    });
    const isFixNoPricingPlanInstalledButServiceOfferedAsPPEnabled = flowApi.experiments.enabled(
      'specs.bookings.FixNoPricingPlanInstalledButServiceOfferedAsPP',
    );
    if (isFixNoPricingPlanInstalledButServiceOfferedAsPPEnabled) {
      if (
        !isPricingPlanInstalled &&
        isOfferedAsPricingPlanOnly(service.payment)
      ) {
        throw EmptyStateErrorType.NO_PRICING_PLAN_INSTALLED_BUT_SERVICE_OFFERED_ONLY_AS_PP;
      }
    }

    const defaultPaymentOptionId = getDefaultPaymentOptionId({
      settings,
      servicePayment: service.payment,
      pricingPlanDetails,
      isPricingPlanInstalled,
    });
    const numberOfParticipants = getNumberOfParticipantsValue(
      service.formSchema,
    );
    const email = getEmailValue(service.formSchema);
    const paymentDetails = mapServicePaymentDto(
      catalogData.service,
    ) as ServicePaymentDetails;
    paymentDetails.totalPrice = paymentDetails.price;

    const selectedPaymentOptionId = getFirstAvailablePaymentOptionId({
      service,
      pricingPlanDetails: pricingPlanDetails!,
      isPricingPlanInstalled: isPricingPlanInstalled!,
      businessInfo: catalogData!.businessInfo,
      selectedPaymentOptionId: defaultPaymentOptionId,
      t,
      settings,
      numberOfParticipants,
    })!;

    const selectedPaymentType = getDefaultPaymentType(
      settings,
      service?.paymentTypes,
    );
    const isBookingsOnEcom = await wixSdkAdapter.isBookingsOnEcom();

    return {
      activeFeatures: catalogData!.activeFeatures,
      service,
      businessInfo: catalogData!.businessInfo,
      slotAvailability: slotAvailability!,
      isPricingPlanInstalled: isPricingPlanInstalled!,
      isMemberAreaInstalled: isMemberAreaInstalled!,
      pricingPlanDetails,
      memberDetails,
      errors,
      paymentDetails,
      selectedPaymentOptionId,
      couponInfo: {
        areCouponsAvailable,
        isCouponInputDisplayed: false,
      },
      editorContext: {
        isDummy: false,
      },
      status: FormStatus.INITIALIZING,
      overrideDefaultFieldsValues: false,
      dialog: undefined,
      formInputs: {
        email,
        numberOfParticipants,
      },
      selectedPaymentType,
      isBookingsOnEcom,
    };
  } catch (formError) {
    return {
      errors: [formError],
    } as FormState;
  }
}

export const getDefaultPaymentType = (
  settings: ControllerFlowAPI['settings'],
  paymentTypes: SelectedPaymentOption[],
) => {
  if (paymentTypes.length === 1) {
    return paymentTypes[0];
  }
  return settings.get(settingsParams.defaultPaymentTime);
};

const fetchInitialData = async ({
  formApi,
  controllerConfig,
  wixSdkAdapter,
  serviceId,
}: {
  formApi: FormApi;
  controllerConfig: IWidgetControllerConfig;
  wixSdkAdapter: WixOOISDKAdapter;
  serviceId?: string;
}) => {
  let errors: FormErrors[] = [];
  if (!serviceId) {
    throw EmptyStateErrorType.INVALID_SERVICE_ID;
  }

  let slotAvailability = getSessionValues(
    wixSdkAdapter,
    BookingsQueryParams.AVAILABILITY_SLOT,
  );
  const resourceId = slotAvailability?.slot!.resource!.id!;
  const startTime = slotAvailability?.slot!.startDate!;
  const user = controllerConfig.wixCodeApi.user.currentUser;

  const [isPricingPlanInstalled, isMemberAreaInstalled] = await Promise.all([
    wixSdkAdapter.isPricingPlanInstalled().catch(() => false),
    wixSdkAdapter.isMemberAreaInstalled().catch(() => false),
  ]);
  const isLoggedInUser = user.loggedIn;
  const shouldGetMemberDetails = isMemberAreaInstalled && isLoggedInUser;
  const shouldGetPricingPlanDetails =
    isPricingPlanInstalled && isLoggedInUser && startTime;

  const [
    areCouponsAvailable,
    catalogData,
    memberDetails,
    pricingPlanDetails,
  ] = await Promise.all([
    formApi.areCouponsAvailableForService(),
    formApi.getCatalogData({ serviceId, resourceId }),
    shouldGetMemberDetails
      ? formApi.getMemberDetails(user.id).catch((e) => {
          errors = [...errors, e];
          return undefined;
        })
      : undefined,
    shouldGetPricingPlanDetails
      ? formApi
          .getPricingPlanDetails({
            serviceId,
            startTime,
          })
          .catch((e) => {
            errors = [...errors, e];
            return undefined;
          })
      : undefined,
  ]);

  const activeSchedule = getActiveSchedule(catalogData?.service!);
  const scheduleId = activeSchedule?.id!;
  const firstSessionStart = activeSchedule?.firstSessionStart;
  const lastSessionEnd = activeSchedule?.lastSessionEnd;

  const type = getServiceType(activeSchedule);
  const isCourse = type === ServiceType.COURSE;

  if (isCourse && !firstSessionStart) {
    throw EmptyStateErrorType.COURSE_WITHOUT_SESSIONS;
  }

  const [listSlots, courseAvailability] = await Promise.all([
    isCourse && lastSessionEnd
      ? formApi.getSlots({
          firstSessionStart: firstSessionStart!,
          lastSessionEnd,
          scheduleId,
        })
      : {},
    isCourse ? formApi.getAvailability({ scheduleId }) : {},
  ]);

  if (isCourse && courseAvailability) {
    const timezone = getCurrentTimezone({
      wixSdkAdapter,
      businessInfo: catalogData.businessInfo,
    });
    slotAvailability = {
      openSpots:
        Number(courseAvailability.capacity) -
        Number(courseAvailability.totalNumberOfParticipants),
      slot: {
        startDate: firstSessionStart,
        endDate: lastSessionEnd,
        timezone,
      },
    };
  }

  const isSlotAvailabilityValid = isCourse || slotAvailability?.slot;
  if (!isSlotAvailabilityValid) {
    throw EmptyStateErrorType.INVALID_SLOT_AVAILABILITY;
  }

  return {
    catalogData,
    listSlots,
    memberDetails,
    slotAvailability,
    pricingPlanDetails,
    isPricingPlanInstalled,
    isMemberAreaInstalled,
    errors,
    areCouponsAvailable,
  };
};

const getNumberOfParticipantsValue = (formSchema: FormView): number => {
  const numberOfParticipants = getFieldFromSchema(
    formSchema,
    BookingRequestKeyMappings.NO_OF_PARTICIPANTS,
  )?.renderInfo?.displayProperties?.defaultValue;
  return (numberOfParticipants && Number(numberOfParticipants)) || 1;
};

const getEmailValue = (formSchema: FormView): string => {
  return getFieldFromSchema(formSchema, BookingRequestKeyMappings.EMAIL)
    ?.renderInfo?.displayProperties?.defaultValue;
};
