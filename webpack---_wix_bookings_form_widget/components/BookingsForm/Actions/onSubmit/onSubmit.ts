import { FormState } from '../../../../utils/state/initialStateFactory';
import { SubmissionResponse, Submission } from '@wix/forms-ui/types';
import { widgetDefaults } from '../../../../utils/bi/consts';
import {
  mapSubmissionToPartialBookRequest,
  mapFormSubmission,
} from '../../../../utils/mappers/form-submission.mapper';
import { DialogType, ReservedPaymentOptionIds } from '../../../../types/types';
import {
  BookingsQueryParams,
  WixOOISDKAdapter,
} from '@wix/bookings-adapter-ooi-wix-sdk';
import { Service } from '../../../../utils/mappers/service.mapper';
import { SlotAvailability } from '@wix/ambassador-availability-calendar/types';
import {
  getSessionValues,
  setFieldsValuesInStorage,
} from '../../../../utils/storageFunctions';
import { CreateActionParams } from '../actions';
import {
  bookingsContactInfoSaveSuccess,
  bookingsPaymentMethodSelectionNextClicked,
} from '@wix/bi-logger-wixboost-ugc/v2';
import { BookErrorType } from '../../../../types/errors';
import {
  CreateCheckoutResponse,
  CreateOrderResponse,
} from '@wix/ambassador-checkout/http';
import { FormStatus } from '../../../../types/form-state';

export type OnSubmit = (submission: SubmissionResponse) => void;

enum FlowType {
  OWNER,
  CHOOSE_PLAN,
  SINGLE_SESSION,
  PREVIEW,
}

export function createOnSubmitAction(
  actionFactoryParams: CreateActionParams,
): OnSubmit {
  return async (submissionResponse) => {
    const [state] = actionFactoryParams.getControllerState();
    const { wixSdkAdapter } = actionFactoryParams.context;
    const { status } = state;
    if (status === FormStatus.IDLE) {
      if (submissionResponse.state.valid) {
        switch (getCurrentFlow(state, wixSdkAdapter)) {
          case FlowType.CHOOSE_PLAN:
            return handleChoosePlanFlow(
              actionFactoryParams,
              submissionResponse.submission,
            );
          case FlowType.OWNER:
            return handleOwnerFlow(actionFactoryParams);
          case FlowType.PREVIEW:
            return handlePreviewFlow(actionFactoryParams);
          case FlowType.SINGLE_SESSION:
            return handleSingleSessionFlow(
              actionFactoryParams,
              submissionResponse.submission,
            );
        }
      }
    }
  };
}

function getCurrentFlow(
  state: FormState,
  wixSdkAdapter: WixOOISDKAdapter,
): FlowType {
  if (wixSdkAdapter.isOwner() && !wixSdkAdapter.isPreviewMode()) {
    return FlowType.OWNER;
  } else if (
    state.selectedPaymentOptionId === ReservedPaymentOptionIds.BuyAPricingPlan
  ) {
    return FlowType.CHOOSE_PLAN;
  } else if (wixSdkAdapter.isPreviewMode()) {
    return FlowType.PREVIEW;
  } else {
    return FlowType.SINGLE_SESSION;
  }
}

export async function handleChoosePlanFlow(
  { getControllerState, context: { wixSdkAdapter } }: CreateActionParams,
  submission: Submission,
) {
  const [state, setState] = getControllerState();
  setState({
    status: FormStatus.PROCESSING_BOOK_REQUEST,
  });
  const { service, slotAvailability, editorContext } = state;
  setFieldsValuesInStorage(wixSdkAdapter, submission);
  if (editorContext.isDummy) {
    await wixSdkAdapter.navigateToPricingPlanPreview();
  } else {
    await purchasePricingPlan(service, wixSdkAdapter, slotAvailability);
  }
}

export async function handleOwnerFlow({
  getControllerState,
  context: { t },
}: CreateActionParams) {
  const [, setState] = getControllerState();
  setState(
    getOwnerSubmitDialog({
      contentText: t('app.dialog.owner-submit.content'),
      confirmButtonText: t('app.dialog.owner-submit.confirm-button'),
    }),
  );
}
export async function handlePreviewFlow({
  context: { wixSdkAdapter },
}: CreateActionParams) {
  await wixSdkAdapter.navigateToBookingsWithSuffix();
}

export async function handleSingleSessionFlow(
  {
    getControllerState,
    internalActions: { errorHandlers },
    context: { biLogger, wixSdkAdapter, formApi, reportError, experiments },
  }: CreateActionParams,
  submission: Submission,
) {
  const [state, setState] = getControllerState();
  const {
    pricingPlanDetails,
    service,
    businessInfo,
    couponInfo,
    slotAvailability,
    selectedPaymentOptionId,
    selectedPaymentType,
  } = state;
  setState({
    status: FormStatus.PROCESSING_BOOK_REQUEST,
  });
  setFieldsValuesInStorage(wixSdkAdapter, submission);
  const selectedPlan = pricingPlanDetails?.plans?.find(
    (plan) => plan?.paidPlan?.orderId === selectedPaymentOptionId,
  );

  if (await wixSdkAdapter.isBookingsOnEcom()) {
    try {
      const {
        contactDetails,
        additionalFields,
        numberOfParticipants,
        sendSmsReminder,
      } = mapFormSubmission(submission, service, businessInfo);
      const checkoutResponse = await formApi.checkoutBooking({
        service,
        slot: slotAvailability.slot!,
        contactDetails,
        additionalFields,
        sendSmsReminder,
        numberOfParticipants,
        appliedCoupon: couponInfo.appliedCoupon,
        selectedPaymentType,
      });
      if (isOnlineFlow(checkoutResponse)) {
        return wixSdkAdapter.navigateToEcomCheckoutPage({
          checkoutId: checkoutResponse!.checkout!.id!,
        });
      } else {
        return wixSdkAdapter.navigateToEcomThankYouPage({
          orderId: checkoutResponse!.orderId!,
        });
      }
    } catch (error) {
      errorHandlers.addError(error as BookErrorType);
      reportError(error as BookErrorType);
      setState({ status: FormStatus.IDLE });
    }
  } else {
    try {
      const { formInfo, sendSmsReminder } = mapSubmissionToPartialBookRequest(
        submission,
        service,
        businessInfo,
      );
      const bookingResponse = await formApi.book({
        service,
        formInfo,
        slotAvailability,
        selectedPlan,
        sendSmsReminder,
        appliedCoupon: couponInfo.appliedCoupon,
      });

      biLogger?.report(
        bookingsContactInfoSaveSuccess({
          smsNotificationRequest: sendSmsReminder,
        }),
      );

      return wixSdkAdapter.navigateToBookingsCheckout(
        bookingResponse.booking!,
        widgetDefaults.pageName,
      );
    } catch (error) {
      errorHandlers.addError(error as BookErrorType);
      setState({ status: FormStatus.IDLE });
      biLogger?.report(
        bookingsPaymentMethodSelectionNextClicked({
          errorMessage: JSON.stringify(error),
        }),
      );
      reportError(error as BookErrorType);
    }
  }
}

function isOnlineFlow(
  checkoutResponse: CreateCheckoutResponse | CreateOrderResponse,
): checkoutResponse is CreateCheckoutResponse {
  return (checkoutResponse as CreateCheckoutResponse).checkout !== undefined;
}

function getOwnerSubmitDialog({
  contentText,
  confirmButtonText,
}: {
  contentText: string;
  confirmButtonText: string;
}): Partial<FormState> {
  return {
    dialog: {
      type: DialogType.OwnerSubmit,
      props: {
        isOpen: true,
        contentText,
        confirmButtonText,
      },
    },
  };
}

function purchasePricingPlan(
  service: Service,
  wixSdkAdapter: WixOOISDKAdapter,
  slotAvailability: SlotAvailability,
) {
  const planIds = service.payment.pricingPlanInfo?.pricingPlans.map(
    (plan) => plan.id,
  );
  const { referral } = getQueryParams(wixSdkAdapter);

  return wixSdkAdapter.navigateToPricingPlan({
    redirectTo: { sectionId: 'Booking Form', relativePath: '' },
    planIds: planIds!,
    maxStartDate: slotAvailability.slot?.startDate!,
    queryParams: {
      referral,
      timezone: slotAvailability.slot?.timezone,
      service: service.id,
    },
  });
}

export function getQueryParams(
  wixSdkAdapter: WixOOISDKAdapter,
): {
  [key: string]: string;
} {
  const referral = wixSdkAdapter.getUrlQueryParamValue(
    BookingsQueryParams.REFERRAL,
  );
  return { referral };
}
