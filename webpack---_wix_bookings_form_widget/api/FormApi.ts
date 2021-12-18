import {
  BulkRequest,
  BulkResponse,
  GetActiveFeaturesResponse,
  GetServiceResponse,
  Rate,
  ServicesCatalogServer,
} from '@wix/ambassador-services-catalog-server/http';
import {
  CalendarServer,
  ListSlotsRequest,
  ListSlotsResponse,
} from '@wix/ambassador-calendar-server/http';
import {
  Slot,
  SlotAvailability,
} from '@wix/ambassador-availability-calendar/types';
import {
  BookingsServer,
  IsAvailableResponse,
} from '@wix/ambassador-bookings-server/http';
import {
  Actor,
  BookedSchedule,
  ContactDetails,
  Gateway as GatewayServer,
  Platform,
  SelectedPaymentOption,
} from '@wix/ambassador-gateway/http';
import {
  PaymentOptionType,
  TotalsCalculator,
} from '@wix/ambassador-totals-calculator/http';
import { CheckoutServer } from '@wix/ambassador-checkout-server/http';
import { CouponsServer } from '@wix/ambassador-coupons-server/http';
import { ServiceType } from '@wix/bookings-uou-types';
import { mapCatalogResourceResponseToStaffMember } from '@wix/bookings-uou-mappers';
import {
  CouponDetails,
  PaidPlans,
  Payments,
  Plan,
} from '@wix/ambassador-checkout-server/types';
import { CatalogData } from './types';
import { Service } from '../utils/mappers/service.mapper';
import { createSessionFromSlotAvailability } from './platformAdaters';
import {
  BOOKINGS_APP_DEF_ID,
  WixOOISDKAdapter,
} from '@wix/bookings-adapter-ooi-wix-sdk';
import { Member } from '@wix/ambassador-members-ng-api/types';
import { MembersNgApi } from '@wix/ambassador-members-ng-api/http';
import { mapBusinessResponseToBusinessInfo } from '../utils/mappers/businessInfo.mapper';
import { BusinessInfo } from '../types/types';
import { FormInfo } from '@wix/ambassador-bookings-server/types';
import { RateLabels } from '../utils/mappers/form-submission.mapper';
import { EmptyStateErrorType, GenericErrorType } from '../types/errors';
import {
  ApiChannelType,
  Checkout as EcomCheckoutServer,
  CreateCheckoutResponse,
  CreateOrderResponse,
} from '@wix/ambassador-checkout/http';
import {
  mapBookingsServerError,
  mapCouponServerError,
  mapCheckoutBookingError,
} from '../utils/errors/errors';
import { ReportError } from '@wix/yoshi-flow-editor';
import { CalculateTotalsResponse } from '@wix/ambassador-totals-calculator/types';
import { CustomFormField } from '@wix/ambassador-gateway/types';
import { couponScope } from '../consts/coupon';

export const CATALOG_SERVER_URL = '_api/services-catalog';
export const BOOKINGS_SERVER_URL = '_api/bookings';
export const BOOKINGS_GATEWAY_URL = '_api/bookings';
export const ECOM_CHECKOUT_URL = 'ecom';
export const CALENDAR_SERVER_URL = '_api/calendar-server';
export const CHECKOUT_SERVER_URL = '_api/checkout-server';
export const MEMBERS_SERVER_API = '_api/members/v1/members';
export const COUPONS_SERVER_URL = '_api/coupons-server';
export const TOTALS_CALCULATOR = '_api/totals-calculator';

export class FormApi {
  private wixSdkAdapter: WixOOISDKAdapter;
  private reportError: ReportError;
  private catalogServer: ReturnType<typeof ServicesCatalogServer>;
  private bookingsServer: ReturnType<typeof BookingsServer>;
  private bookingsGatewayServer: ReturnType<typeof GatewayServer>;
  private ecomCheckoutServer: ReturnType<typeof EcomCheckoutServer>;
  private calendarServer: ReturnType<typeof CalendarServer>;
  private checkoutServer: ReturnType<typeof CheckoutServer>;
  private couponsServer: ReturnType<typeof CouponsServer>;
  private membersServer: ReturnType<typeof MembersNgApi>;
  private totalsCalculatorServer: ReturnType<typeof TotalsCalculator>;

  constructor({
    wixSdkAdapter,
    reportError,
  }: {
    wixSdkAdapter: WixOOISDKAdapter;
    reportError: ReportError;
  }) {
    this.wixSdkAdapter = wixSdkAdapter;
    this.reportError = reportError;
    const baseUrl = wixSdkAdapter.getServerBaseUrl();
    this.catalogServer = ServicesCatalogServer(
      `${baseUrl}${CATALOG_SERVER_URL}`,
    );
    this.bookingsServer = BookingsServer(`${baseUrl}${BOOKINGS_SERVER_URL}`);
    this.bookingsGatewayServer = GatewayServer(
      `${baseUrl}${BOOKINGS_GATEWAY_URL}`,
    );
    this.ecomCheckoutServer = EcomCheckoutServer(
      `${baseUrl}${ECOM_CHECKOUT_URL}`,
    );
    this.calendarServer = CalendarServer(`${baseUrl}${CALENDAR_SERVER_URL}`);
    this.checkoutServer = CheckoutServer(`${baseUrl}${CHECKOUT_SERVER_URL}`);
    this.couponsServer = CouponsServer(`${baseUrl}${COUPONS_SERVER_URL}`);
    this.membersServer = MembersNgApi(`${baseUrl}${MEMBERS_SERVER_API}`, {
      ignoredProtoHttpUrlPart: '/v1/members',
    });
    this.totalsCalculatorServer = TotalsCalculator(
      `${baseUrl}${TOTALS_CALCULATOR}`,
    );
  }

  getAuthorization() {
    return this.wixSdkAdapter.getInstance();
  }

  async getCatalogData({
    serviceId,
    resourceId,
  }: {
    serviceId?: string;
    resourceId?: string;
  } = {}): Promise<CatalogData> {
    try {
      const servicesCatalogService = this.catalogServer.Bulk();
      const bulkRequest: BulkRequest = this.createBulkRequest({
        serviceId,
        resourceId,
      });
      const catalogData: BulkResponse = await servicesCatalogService({
        Authorization: this.getAuthorization(),
      }).get(bulkRequest);

      const service: GetServiceResponse = catalogData.responseService!;
      const businessInfo: BusinessInfo = mapBusinessResponseToBusinessInfo(
        catalogData.responseBusiness!,
      );

      const activeFeatures: GetActiveFeaturesResponse = catalogData.responseBusiness!
        .activeFeatures!;
      const serviceResourcesIds =
        service?.resources?.map((resource) => resource.id) || [];
      const relevantResources = catalogData.responseResources!.resources!.filter(
        (resource) =>
          resourceId || serviceResourcesIds.includes(resource.resource!.id),
      );
      const staffMembers = relevantResources.map(
        mapCatalogResourceResponseToStaffMember,
      );

      return {
        service,
        businessInfo,
        activeFeatures,
        staffMembers,
      };
    } catch (e) {
      this.reportError(e);
      throw EmptyStateErrorType.INVALID_CATALOG_DATA;
    }
  }

  async getSlots({
    firstSessionStart,
    lastSessionEnd,
    scheduleId,
  }: {
    firstSessionStart: string;
    lastSessionEnd: string;
    scheduleId: string;
  }): Promise<ListSlotsResponse> {
    try {
      const calendarService = this.calendarServer.CalendarService();
      // @ts-expect-error
      const fields: string[] = null;
      // @ts-expect-error
      const fieldsets: string[] = null;
      const filter = {
        from: new Date(firstSessionStart).toISOString(),
        to: new Date(lastSessionEnd).toISOString(),
        scheduleIds: [scheduleId],
      };
      const request: ListSlotsRequest = {
        query: {
          fieldsets,
          fields,
          sort: [],
          filter: JSON.stringify(filter),
        },
      };

      const calendarServiceResponse = calendarService({
        Authorization: this.getAuthorization(),
      });
      const listSlotsResponse = await calendarServiceResponse.listSlots(
        request,
      );
      return listSlotsResponse;
    } catch (e) {
      this.reportError(e);
      throw EmptyStateErrorType.NO_LIST_SLOTS;
    }
  }

  async getMemberDetails(id: string): Promise<Maybe<Member>> {
    try {
      if (this.wixSdkAdapter.isEditorMode()) {
        return;
      }
      const membersService = this.membersServer.Members();
      const { member } = await membersService({
        Authorization: this.getAuthorization(),
      }).getMember({
        fieldSet: 'FULL',
        id,
      });

      return member;
    } catch (e) {
      this.reportError(e);
      throw GenericErrorType.GENERIC_MEMBER_DETAILS_ERROR;
    }
  }

  async getAvailability({
    scheduleId,
  }: {
    scheduleId: string;
  }): Promise<IsAvailableResponse> {
    try {
      const response = await this.bookingsServer
        .Availability()({ Authorization: this.getAuthorization() })
        .isAvailable({
          scheduleId,
          partySize: 1,
        });
      return response;
    } catch (e) {
      this.reportError(e);
      throw EmptyStateErrorType.NO_COURSE_AVAILABILITY;
    }
  }

  async getPricingPlanDetails({
    serviceId,
    startTime,
  }: {
    serviceId: string;
    startTime: string;
  }): Promise<Maybe<PaidPlans>> {
    try {
      const response = await this.checkoutServer
        .CheckoutBackend()({ Authorization: this.getAuthorization() })
        .checkoutOptions({
          createSession: {
            scheduleOwnerId: serviceId,
            start: {
              timestamp: startTime,
            },
          },
          paymentSelection: {
            numberOfParticipants: 1,
          },
        });
      return response.checkoutOptions?.paidPlans;
    } catch (e) {
      this.reportError(e);
      throw GenericErrorType.GENERIC_PRICING_PLAN_ERROR;
    }
  }

  async areCouponsAvailableForService(): Promise<boolean> {
    try {
      const { hasCoupons } = await this.couponsServer
        .CouponsV2()({ Authorization: this.getAuthorization() })
        .hasCoupons({});
      return hasCoupons;
    } catch (e) {
      this.reportError(e);
      return false;
    }
  }

  async getPaymentsDetails({
    slot,
    numberOfParticipants,
    rate,
    serviceId,
    couponCode,
    email,
  }: {
    slot: Slot;
    numberOfParticipants: number;
    rate: Rate;
    serviceId: string;
    couponCode?: string;
    email?: string;
  }): Promise<Maybe<Payments>> {
    try {
      const { scheduleId, startDate, endDate } = slot;
      const response = await this.checkoutServer
        .CheckoutBackend()({ Authorization: this.getAuthorization() })
        .checkoutOptions({
          scheduleId,
          couponCode,
          createSession: {
            rate,
            scheduleOwnerId: serviceId,
            start: {
              timestamp: startDate,
            },
            end: {
              timestamp: endDate,
            },
          },
          paymentSelection: {
            numberOfParticipants,
            rateLabel: RateLabels.GENERAL,
          },
          ...(email && { email }),
        });
      return response.checkoutOptions?.payments;
    } catch (e) {
      this.reportError(e);
      const errorResponse = JSON.stringify(e);
      throw mapCouponServerError(errorResponse);
    }
  }

  async checkoutBooking({
    slot,
    service,
    contactDetails,
    additionalFields,
    numberOfParticipants,
    sendSmsReminder,
    appliedCoupon,
    selectedPaymentType,
  }: {
    slot: Slot;
    service: Service;
    contactDetails: ContactDetails;
    additionalFields: CustomFormField[];
    numberOfParticipants: number;
    sendSmsReminder?: boolean;
    appliedCoupon?: CouponDetails;
    selectedPaymentType: SelectedPaymentOption;
  }): Promise<CreateCheckoutResponse | CreateOrderResponse> {
    try {
      const isCourse = service.type === ServiceType.COURSE;
      const createBookingResponse = await this.bookingsGatewayServer
        .BookingsGateway()({ Authorization: this.getAuthorization() })
        .createBooking({
          ...(isCourse
            ? {
                schedule: this.mapBookedSchedule({ service, slot }),
              }
            : { slot }),
          contactDetails,
          additionalFields,
          numberOfParticipants,
          sendSmsReminder,
          selectedPaymentOption: selectedPaymentType,
          participantNotification: {
            notifyParticipants: true,
          },
          bookingSource: {
            actor: Actor.CUSTOMER,
            platform: Platform.WEB,
          },
        });
      const createCheckoutResponse = await this.ecomCheckoutServer
        .CheckoutService()({
          Authorization: this.getAuthorization(),
        })
        .createCheckout({
          channelType: ApiChannelType.WEB,
          lineItems: [
            {
              quantity: 1,
              catalogReference: {
                catalogItemId: createBookingResponse!.booking!.id,
                appId: BOOKINGS_APP_DEF_ID,
              },
            },
          ],
          couponCode: appliedCoupon?.couponCode,
          checkoutInfo: {
            billingInfo: {
              contactDetails: this.mapContactDetails(contactDetails),
              address:
                contactDetails.fullAddress || fakeAddressForEcomIntegration,
            },
            buyerInfo: {
              email: contactDetails.email,
            },
          },
        });
      if (this.isOfflineCheckoutFlow(createCheckoutResponse)) {
        const createOrderResponse = await this.ecomCheckoutServer
          .CheckoutService()({
            Authorization: this.getAuthorization(),
          })
          .createOrder({
            id: createCheckoutResponse?.checkout?.id,
          });
        return createOrderResponse;
      } else {
        return createCheckoutResponse;
      }
    } catch (error) {
      throw mapCheckoutBookingError(error?.response);
    }
  }

  async calculateTotalPrice({
    price,
    numberOfParticipants,
    couponCode,
    email,
    selectedPaymentType,
  }: {
    price: number;
    numberOfParticipants: number;
    couponCode?: string;
    email?: string;
    selectedPaymentType: SelectedPaymentOption;
  }): Promise<CalculateTotalsResponse> {
    const calculateTotalsResponse = await this.totalsCalculatorServer
      .TotalsCalculator()({
        Authorization: this.getAuthorization(),
      })
      .calculateTotals({
        couponCode,
        buyerEmail: email,
        lineItems: [
          {
            id: '1',
            price: String(price * numberOfParticipants),
            quantity: 1,
            couponScopes: [couponScope],
            paymentOption:
              selectedPaymentType === SelectedPaymentOption.ONLINE
                ? PaymentOptionType.FULL_PAYMENT_ONLINE
                : PaymentOptionType.FULL_PAYMENT_OFFLINE,
          },
        ],
      });

    const couponError =
      calculateTotalsResponse.calculationErrors?.couponCalculationError
        ?.applicationError?.code;
    if (couponError) {
      throw mapCouponServerError(couponError);
    }

    return calculateTotalsResponse;
  }

  async book({
    service,
    formInfo,
    slotAvailability,
    selectedPlan,
    sendSmsReminder,
    appliedCoupon,
  }: {
    service: Service;
    formInfo: FormInfo;
    slotAvailability?: SlotAvailability;
    selectedPlan?: Plan;
    sendSmsReminder?: boolean;
    appliedCoupon?: CouponDetails;
  }) {
    try {
      const serviceTypeSpecificPayload = this.serviceTypeDependentRequestPayload(
        service,
        slotAvailability,
      );

      const response = await this.bookingsServer
        .Bookings()({ Authorization: this.getAuthorization() })
        .book({
          ...serviceTypeSpecificPayload,
          formInfo,
          ...(appliedCoupon ? { couponCode: appliedCoupon.couponCode } : {}),
          planSelection: selectedPlan?.paidPlan,
          sendSmsReminder,
          notifyParticipants: true,
        });

      return response;
    } catch (e) {
      this.reportError(e);
      throw mapBookingsServerError(e?.response);
    }
  }

  private serviceTypeDependentRequestPayload(
    service: Service,
    slotAvailability?: SlotAvailability,
  ) {
    switch (service.type) {
      case ServiceType.INDIVIDUAL:
        return {
          createSession: createSessionFromSlotAvailability(slotAvailability!),
        };
      case ServiceType.GROUP:
        return {
          bySessionId: {
            sessionId: slotAvailability!.slot!.sessionId,
          },
        };
      case ServiceType.COURSE:
        return {
          scheduleId: service.scheduleId,
        };
    }
  }

  private createBulkRequest({
    serviceId,
    resourceId,
  }: {
    serviceId?: string;
    resourceId?: string;
  }): BulkRequest {
    const filterByResourceType = {
      'resource.tags': { $hasSome: ['staff'] },
    };
    const filterById = {
      'resource.id': resourceId,
    };
    const filter = resourceId ? filterById : filterByResourceType;

    return {
      ...(serviceId
        ? {
            requestService: {
              id: serviceId,
              fields: [],
            },
          }
        : {}),
      requestBusiness: {
        suppressNotFoundError: false,
      },
      requestListResources: {
        includeDeleted: true,
        query: {
          filter: JSON.stringify(filter),
          fields: ['resource.id', 'resource.name'],
          fieldsets: [],
          paging: {
            limit: 1000,
          },
          sort: [],
        },
      },
    };
  }

  private isOfflineCheckoutFlow(
    createCheckoutResponse: CreateCheckoutResponse,
  ) {
    const payNowAmount =
      createCheckoutResponse?.checkout?.payNow?.total?.amount;
    return payNowAmount && Number(payNowAmount) === 0;
  }

  private mapBookedSchedule({
    service,
    slot,
  }: {
    service: Service;
    slot: Slot;
  }): BookedSchedule {
    return {
      scheduleId: service.scheduleId,
      timezone: slot.timezone,
    };
  }

  private mapContactDetails(contactDetails: ContactDetails): ContactDetails {
    if (contactDetails.lastName) {
      return contactDetails;
    }
    const nameParts = contactDetails?.firstName?.split(' ');
    const firstName = nameParts?.[0];
    const lastName = nameParts?.[1];
    return {
      ...contactDetails,
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
    };
  }
}

const fakeAddressForEcomIntegration = {
  city: 'tel-aviv',
  country: 'IL',
  streetAddress: {
    apt: '12',
    name: 'kocs',
    number: '13',
  },
};
