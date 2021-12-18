import { OfferedAsType, ServicePayment } from '@wix/bookings-uou-types';
import { PaidPlans, Plan } from '@wix/ambassador-checkout-server/types';
import {
  isServiceOfferedAsPricingPlan,
  PaymentDtoMapper,
} from '@wix/bookings-uou-mappers';
import {
  BusinessInfo,
  PaymentMethod,
  PaymentOption,
  ReservedPaymentOptionIds,
  TFunction,
} from '../../types/types';
import { DateTimeFormatter } from '@wix/bookings-date-time';
import { getContent } from '../content/content';
import settingsParams from '../../components/BookingsForm/settingsParams';
import { ControllerFlowAPI } from '@wix/yoshi-flow-editor';
import { Service } from '../mappers/service.mapper';
import { ISettingsGetter } from '@wix/tpa-settings';

export const isOfferedAsOneTime = (servicePayment: ServicePayment) => {
  return servicePayment.offeredAs.includes(OfferedAsType.ONE_TIME);
};

export const isOfferedAsOneTimeOnly = (servicePayment: ServicePayment) => {
  return (
    servicePayment.offeredAs.length === 1 && isOfferedAsOneTime(servicePayment)
  );
};

export const isOfferedAsPricingPlanOnly = (servicePayment: ServicePayment) => {
  return (
    servicePayment.offeredAs.length <= 1 &&
    isServiceHavePricingPlans(servicePayment)
  );
};

export const isFixedPrice = (servicePayment: ServicePayment) => {
  return servicePayment.paymentDetails.price > 0;
};

export const isServiceHavePricingPlans = (servicePayment: ServicePayment) => {
  return servicePayment.pricingPlanInfo?.pricingPlans?.length! > 0;
};

const isDisabledPlan = ({
  plan,
  numberOfParticipants,
}: {
  plan: Plan;
  numberOfParticipants: number;
}) => {
  const isMembershipPlan = !plan.creditRemain;
  return (
    Number(plan?.creditRemain) < numberOfParticipants ||
    (isMembershipPlan && numberOfParticipants > 1)
  );
};

export const getPaymentOptions = ({
  pricingPlanDetails,
  servicePayment,
  t,
  settings,
  dateAndTimeFormatter,
  isPricingPlanInstalled,
  numberOfParticipants,
  dateRegionalSettingsLocale,
}: {
  pricingPlanDetails?: PaidPlans;
  servicePayment: ServicePayment;
  t: TFunction;
  settings: ControllerFlowAPI['settings'];
  dateAndTimeFormatter: DateTimeFormatter;
  isPricingPlanInstalled: boolean;
  numberOfParticipants: number;
  dateRegionalSettingsLocale: string;
}): PaymentOption[] => {
  if (!servicePayment) {
    return [];
  }

  const pricingPlans =
    pricingPlanDetails?.plans?.map((plan) => {
      const disabled = isDisabledPlan({ plan, numberOfParticipants });
      return {
        id: plan.paidPlan?.orderId!,
        label: plan.planName!,
        disabled,
        ...(plan.creditRemain && plan.creditOriginal
          ? { suffix: plan.creditRemain + '/' + plan.creditOriginal }
          : {}),
        ...(plan.validUntil
          ? {
              validUntil: t('app.payment.valid-until.text', {
                validUntil: dateAndTimeFormatter.formatDate(plan.validUntil),
              }),
            }
          : {}),
        ...(plan.creditRemain ? { creditRemain: plan.creditRemain } : {}),
      };
    }) || [];

  const showBuyAPricingPlan =
    isServiceOfferedAsPricingPlan(servicePayment, isPricingPlanInstalled) &&
    pricingPlans.length === 0;
  const showPaySingleSession = isOfferedAsOneTime(servicePayment);

  return [
    ...pricingPlans,
    ...(showBuyAPricingPlan
      ? [
          {
            id: ReservedPaymentOptionIds.BuyAPricingPlan,
            label: getContent({
              settings,
              settingsParam: settingsParams.pricingPlanText,
            }),
            disabled: false,
          },
        ]
      : []),
    ...(showPaySingleSession
      ? [
          {
            id: ReservedPaymentOptionIds.SingleSession,
            ...getPriceText(
              servicePayment,
              dateRegionalSettingsLocale,
              settings,
            ),
            disabled: false,
          },
        ]
      : []),
  ];
};

export const getFirstAvailablePaymentOptionId = ({
  service,
  pricingPlanDetails,
  isPricingPlanInstalled,
  businessInfo,
  numberOfParticipants,
  selectedPaymentOptionId,
  t,
  settings,
}: {
  service: Service;
  pricingPlanDetails: PaidPlans;
  isPricingPlanInstalled: boolean;
  businessInfo: BusinessInfo;
  numberOfParticipants: number;
  selectedPaymentOptionId: string;
  t: TFunction;
  settings: {
    get: ISettingsGetter;
  };
}) => {
  const dateRegionalSettingsLocale = businessInfo?.dateRegionalSettingsLocale!;
  const dateAndTimeFormatter = new DateTimeFormatter(
    dateRegionalSettingsLocale!,
  );
  const paymentOptions = getPaymentOptions({
    servicePayment: service?.payment,
    pricingPlanDetails,
    isPricingPlanInstalled,
    dateAndTimeFormatter,
    numberOfParticipants,
    dateRegionalSettingsLocale,
    t,
    settings,
  });
  const currentSelectedOption = paymentOptions.find(
    (paymentOption) => paymentOption.id === selectedPaymentOptionId,
  );
  if (currentSelectedOption?.disabled) {
    return paymentOptions.find((paymentOption) => !paymentOption.disabled)?.id;
  }
  return currentSelectedOption?.id;
};

const getPriceText = (
  payment: ServicePayment,
  dateRegionalSettingsLocale: string,
  settings: ControllerFlowAPI['settings'],
) => {
  const price = new PaymentDtoMapper(dateRegionalSettingsLocale).priceText(
    payment.paymentDetails,
  );
  if (payment.paymentDetails.priceText) {
    return {
      label: price,
    };
  }
  return {
    label: getContent({
      settings,
      settingsParam: settingsParams.singleSessionText,
    }),
    suffix: price,
  };
};

export const getDefaultPaymentOptionId = ({
  settings,
  servicePayment,
  pricingPlanDetails,
  isPricingPlanInstalled,
}: {
  settings: ControllerFlowAPI['settings'];
  servicePayment: ServicePayment;
  isPricingPlanInstalled: boolean;
  pricingPlanDetails?: PaidPlans;
}) => {
  const planId = pricingPlanDetails?.defaultPlan?.paidPlan?.orderId;
  if (planId) {
    return planId;
  }
  if (isOfferedAsOneTimeOnly(servicePayment) || !isPricingPlanInstalled) {
    return ReservedPaymentOptionIds.SingleSession;
  }
  if (isOfferedAsPricingPlanOnly(servicePayment)) {
    return ReservedPaymentOptionIds.BuyAPricingPlan;
  }
  return settings.get(settingsParams.defaultPaymentMethod) ===
    PaymentMethod.SINGLE || !isServiceHavePricingPlans(servicePayment)
    ? ReservedPaymentOptionIds.SingleSession
    : ReservedPaymentOptionIds.BuyAPricingPlan;
};
