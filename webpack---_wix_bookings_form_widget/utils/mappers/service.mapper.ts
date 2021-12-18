import { PaidPlans } from '@wix/ambassador-checkout-server/types';
import {
  ServiceLocation,
  ServicePayment,
  ServiceType,
  StaffMember,
} from '@wix/bookings-uou-types';
import { ListSlotsResponse } from '@wix/ambassador-calendar-server/types';
import {
  Location as SlotLocation,
  LocationType,
  SlotAvailability,
} from '@wix/ambassador-availability-calendar/types';
import { CatalogData } from '../../api/types';
import {
  ActionLabels,
  GetServiceResponse,
  Header as FormHeader,
  PaymentOptions,
  Rate,
  Schedule,
  ScheduleStatus,
} from '@wix/ambassador-services-catalog-server/http';
import {
  mapServiceLocations,
  mapServicePayment,
} from '@wix/bookings-uou-mappers';
import { FormView, Submission } from '@wix/forms-ui/types';
import { createFormView } from './service-form.mapper';
import { TFunction } from '../../types/types';
import { isOfferedAsPricingPlanOnly } from '../payment/payment';
import { SelectedPaymentOption } from '@wix/ambassador-gateway/types';

export type Location = {
  id?: string;
  name?: string;
  address?: string;
  locationType: LocationType;
};

export type Service = {
  id: string;
  name: string;
  rate: Rate;
  staffMembers: StaffMember[];
  location: Location;
  isPendingApprovalFlow: boolean;
  isWaitingListFlow: boolean;
  paymentTypes: SelectedPaymentOption[];
  type: ServiceType;
  scheduleId: string;
  formSchema: FormView;
  formHeader: FormHeader;
  totalNumberOfSessions: number;
  payment: ServicePayment;
  videoConferenceProviderId?: string;
  actionLabels?: ActionLabels;
};

export const mapCatalogServiceToService = ({
  serviceId,
  catalogData,
  slotAvailability,
  t,
  pricingPlanDetails,
  listSlots,
  preFilledValues,
  isNameFieldDeprecationEnabled,
}: {
  serviceId: string;
  catalogData: CatalogData;
  slotAvailability: SlotAvailability;
  t: TFunction;
  pricingPlanDetails?: PaidPlans;
  listSlots?: ListSlotsResponse;
  preFilledValues?: Submission;
  isNameFieldDeprecationEnabled?: boolean;
}): Service => {
  const activeSchedule = getActiveSchedule(catalogData.service);
  const scheduleId = activeSchedule!.id!;
  const serviceType = getServiceType(activeSchedule);

  const staffMembers = catalogData.staffMembers.map((staffMember) => {
    return {
      id: staffMember.id!,
      name: staffMember.name,
    };
  });

  const slotLocation: Maybe<SlotLocation> = slotAvailability?.slot?.location;
  const serviceLocation: ServiceLocation = mapServiceLocations(
    activeSchedule,
  )[0];

  const isCourse = serviceType === ServiceType.COURSE;

  const location = isCourse
    ? mapServiceLocationToLocation(serviceLocation)
    : mapSlotLocationToLocation(slotLocation);

  const paymentOptions: PaymentOptions = catalogData.service.service
    ?.paymentOptions!;
  const paymentTypes: SelectedPaymentOption[] = mapPaymentOptionsToPaymentTypes(
    paymentOptions,
    pricingPlanDetails,
  );

  const payment = mapServicePayment(catalogData.service);
  const formSchema = createFormView({
    catalogData,
    availability: slotAvailability,
    preFilledValues,
    pricingPlanDetails: isOfferedAsPricingPlanOnly(payment)
      ? pricingPlanDetails
      : undefined,
    t,
    isNameFieldDeprecationEnabled,
  });
  const rate = activeSchedule.rate!;

  const formHeader = catalogData.service.form?.header!;

  const isPendingApprovalFlow = !!catalogData.service.service?.policy
    ?.bookingsApprovalPolicy?.isBusinessApprovalRequired;

  return {
    id: serviceId,
    name: catalogData.service.service!.info!.name!,
    formHeader,
    rate,
    payment,
    type: serviceType,
    staffMembers,
    paymentTypes,
    location,
    totalNumberOfSessions: listSlots?.slots?.length || 1,
    isPendingApprovalFlow,
    isWaitingListFlow: !!catalogData.service.service?.policy?.waitingListPolicy
      ?.isEnabled,
    videoConferenceProviderId: activeSchedule?.conferenceProvider?.providerId,
    scheduleId,
    formSchema,
    actionLabels: catalogData.service.form?.actionLabels,
  };
};

export const getActiveSchedule = (service: GetServiceResponse): Schedule => {
  return (
    service?.schedules?.find(
      (schedule) => schedule.status === ScheduleStatus.CREATED,
    ) || service?.schedules?.[0]!
  );
};

export const getServiceType = (schedule: Schedule): ServiceType => {
  return (
    (schedule?.tags?.find(
      (tag: string) =>
        tag === ServiceType.COURSE ||
        tag === ServiceType.GROUP ||
        tag === ServiceType.INDIVIDUAL,
    ) as ServiceType) || ServiceType.INDIVIDUAL
  );
};

const mapPaymentOptionsToPaymentTypes = (
  paymentOptions: PaymentOptions,
  pricingPlanDetails?: PaidPlans,
): SelectedPaymentOption[] => {
  const paymentTypes = [];
  if (paymentOptions?.wixPayOnline) {
    paymentTypes.push(SelectedPaymentOption.ONLINE);
  }
  if (paymentOptions?.wixPayInPerson) {
    paymentTypes.push(SelectedPaymentOption.OFFLINE);
  }
  if (pricingPlanDetails?.plans?.length && paymentOptions?.wixPaidPlan) {
    paymentTypes.push(SelectedPaymentOption.WIX_PAID_PLAN);
  }
  return paymentTypes;
};

const mapServiceLocationToLocation = (location: ServiceLocation): Location => {
  return {
    id: location.businessLocation?.id,
    name: location.businessLocation?.name,
    ...{
      address:
        location?.locationText ??
        location?.businessLocation?.address?.formattedAddress,
    },
    locationType: location?.type as any,
  };
};

const mapSlotLocationToLocation = (location?: SlotLocation): Location => {
  return {
    id: location?.id,
    name: location?.name,
    address: location?.formattedAddress,
    locationType: location!.locationType!,
  };
};
