import {
  BookingsServer,
  LocationLocationType,
} from '@wix/ambassador-bookings-server/http';
import { PricingPlanBenefitsServer } from '@wix/ambassador-pricing-plan-benefits-server/http';
import {
  GetBalanceRequest,
  Balance,
} from '@wix/ambassador-pricing-plan-benefits-server/types';
import {
  BulkRequest,
  BulkResponse,
  ServicesCatalogServer,
  GetActiveFeaturesResponse,
  GetServiceResponse,
} from '@wix/ambassador-services-catalog-server/http';
import {
  mapCatalogServiceResponseToService,
  mapResponseToBusinessInfo,
  mapCatalogResourceResponseToStaffMember,
} from '@wix/bookings-uou-mappers';
import { BusinessInfoBase, CatalogData } from '@wix/bookings-uou-types';
import {
  QueryAvailabilityRequest,
  QueryAvailabilityResponse,
} from '@wix/ambassador-availability-calendar/types';
import {
  AvailabilityCalendar,
  Location,
  LocationType,
} from '@wix/ambassador-availability-calendar/http';

interface CatalogDataFilter {
  servicesOptions?: {
    slug?: string;
    include: boolean;
  };
  resourcesOptions?: {
    slug?: string;
    include: boolean;
  };
}

export const CATALOG_SERVER_URL = '_api/services-catalog';
export const BOOKINGS_SERVER_URL = '_api/bookings';
export const AVAILABILITY_SERVER_URL = '_api/availability-calendar';
export const CHECKOUT_SERVER_URL = '_api/checkout-server';
export const PRICING_PLAN__BENEFITS_SERVER_API = '_api/pricing-plan-benefits';

export class BookingsApi {
  private authorization: string;
  private catalogServer: ReturnType<typeof ServicesCatalogServer>;
  private bookingsServer: ReturnType<typeof BookingsServer>;
  private availabilityCalendarServer: ReturnType<typeof AvailabilityCalendar>;
  private pricingPlanBenefitsServer: ReturnType<
    typeof PricingPlanBenefitsServer
  >;

  constructor({
    authorization,
    baseUrl,
  }: {
    authorization: string;
    baseUrl: string;
  }) {
    this.authorization = authorization;
    this.catalogServer = ServicesCatalogServer(
      `${baseUrl}${CATALOG_SERVER_URL}`,
    );
    this.availabilityCalendarServer = AvailabilityCalendar(
      `${baseUrl}${AVAILABILITY_SERVER_URL}`,
    );
    this.bookingsServer = BookingsServer(`${baseUrl}${BOOKINGS_SERVER_URL}`);
    this.pricingPlanBenefitsServer = PricingPlanBenefitsServer(
      `${baseUrl}${PRICING_PLAN__BENEFITS_SERVER_API}`,
    );
  }

  async getCatalogData({
    servicesOptions,
    resourcesOptions,
  }: CatalogDataFilter): Promise<
    CatalogData & { seoData?: GetServiceResponse[] }
  > {
    const servicesCatalogService = this.catalogServer.Bulk();

    const bulkRequest: BulkRequest = this.createBulkRequest({
      servicesOptions,
      resourcesOptions,
    });
    const catalogData: BulkResponse = await servicesCatalogService({
      Authorization: this.authorization,
    }).get(bulkRequest);

    const services = servicesOptions?.include
      ? catalogData.responseServices!.services!.map((service) =>
          mapCatalogServiceResponseToService(service),
        )
      : [];
    const businessInfo: BusinessInfoBase = mapResponseToBusinessInfo(
      catalogData.responseBusiness!,
    );
    const activeFeatures: GetActiveFeaturesResponse = catalogData.responseBusiness!
      .activeFeatures!;

    const staffMembers = catalogData.responseResources?.resources?.map(
      mapCatalogResourceResponseToStaffMember,
    );

    return {
      services,
      businessInfo,
      activeFeatures,
      staffMembers,
      seoData: catalogData.responseServices?.services || [],
    };
  }

  async getSlotsAvailability(
    queryAvailabilityRequest: QueryAvailabilityRequest,
  ): Promise<QueryAvailabilityResponse> {
    const availabilityCalendarService = this.availabilityCalendarServer.AvailabilityCalendar();

    const availability: QueryAvailabilityResponse = await availabilityCalendarService(
      {
        Authorization: this.authorization,
      },
    ).queryAvailability(queryAvailabilityRequest);

    return availability;
  }

  async getBookingDetails(bookingId: string) {
    const response = await this.bookingsServer
      .BookingsReader()({ Authorization: this.authorization })
      .query({
        withBookingAllowedActions: true,
        query: {
          filter: JSON.stringify({ bookingId }),
          fields: [],
          fieldsets: [],
          sort: [],
        },
      });

    return response.bookingsEntries![0].booking;
  }

  async rescheduleClassBooking({
    bookingId,
    sessionId,
  }: {
    bookingId: string;
    sessionId: string;
  }) {
    const response = await this.bookingsServer
      .Bookings()({ Authorization: this.authorization })
      .reschedule({
        bookingId,
        bySessionId: {
          sessionId,
        },
      });

    return response;
  }

  async rescheduleAppointmentBooking({
    bookingId,
    scheduleId,
    timezone,
    start,
    end,
    staffMembersScheduleIds,
    location,
  }: {
    bookingId: string;
    scheduleId: string;
    timezone: string;
    start: string;
    end: string;
    staffMembersScheduleIds: string[];
    location?: Location;
  }) {
    return this.bookingsServer
      .Bookings()({ Authorization: this.authorization })
      .reschedule({
        bookingId,
        createSession: {
          location:
            location?.id &&
            location?.locationType === LocationType.OWNER_BUSINESS
              ? {
                  locationType: LocationLocationType.OWNER_BUSINESS,
                  businessLocation: {
                    id: location.id,
                  },
                }
              : undefined,
          scheduleId,
          start: {
            timeZone: timezone,
            timestamp: start,
          },
          end: {
            timeZone: timezone,
            timestamp: end,
          },
          affectedSchedules: staffMembersScheduleIds.map((id) => ({
            scheduleId: id,
          })),
        },
      });
  }

  private createBulkRequest({
    servicesOptions,
    resourcesOptions,
  }: CatalogDataFilter): BulkRequest {
    return {
      requestServices: servicesOptions?.include
        ? {
            includeDeleted: false,
            query: {
              fieldsets: [],
              filter: servicesOptions.slug
                ? `{"slugs.name": "${servicesOptions.slug}"}`
                : null,
              paging: {
                limit: 500,
              },
              fields: [],
              sort: [],
            },
          }
        : undefined,
      requestBusiness: {
        suppressNotFoundError: false,
      },
      requestListResources: resourcesOptions?.include
        ? {
            query: {
              fieldsets: [],
              filter: resourcesOptions.slug
                ? `{"slugs.name": "${resourcesOptions.slug}"}`
                : null,
              paging: {
                limit: 500,
              },
              fields: [],
              sort: [],
            },
          }
        : undefined,
    };
  }

  async getPurchasedPricingPlans({
    contactId,
    authorization,
  }: {
    contactId: string;
    authorization: string;
  }): Promise<Balance[]> {
    const balanceRequest: GetBalanceRequest = {
      contactId,
    };
    const benefits = await this.pricingPlanBenefitsServer
      .MemberBenefits()({ Authorization: authorization })
      .getBalance(balanceRequest);
    return benefits.balanceItems || [];
  }
}
