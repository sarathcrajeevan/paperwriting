import {
  CatalogData,
  Service,
  ServiceType,
  OfferedAsType,
  PaymentType,
  TimezoneType,
  ServiceLocationType,
} from '@wix/bookings-uou-types';
import { ControllerFlowAPI } from '@wix/yoshi-flow-editor';

export function createDummyCatalogData(
  flowAPI: ControllerFlowAPI,
): CatalogData {
  const { t, config } = flowAPI.translations;
  const service: Service = {
    id: 'some-id',
    info: {
      name: t('dummy-content.service.name'),
      tagline: t('dummy-content.service.tagline'),
      type: ServiceType.INDIVIDUAL,
      slug: t('dummy-content.service.name').replace(' ', '-').toLowerCase(),
    },
    locations: [
      {
        type: ServiceLocationType.OWNER_BUSINESS,
        businessLocation: {
          id: 'location-1-id',
        },
      },
      {
        type: ServiceLocationType.OWNER_BUSINESS,
        businessLocation: {
          id: 'location-2-id',
        },
      },
    ],
    staffMembers: [
      {
        id: 'staff-1-id',
        name: t('dummy-content.service.staff'),
      },
      {
        id: 'staff-2-id',
        name: t('dummy-content.service.staff-2'),
      },
    ],
    policy: {
      uouHidden: false,
      isBookOnlineAllowed: true,
      isPendingApprovalFlow: false,
      maxParticipantsPerBook: 1,
      capacity: 1,
      minutesBeforeSlotBookWindowStart: 0,
      minutesBeforeSlotBookWindowEnd: 0,
    },
    payment: {
      offeredAs: [OfferedAsType.ONE_TIME],
      paymentDetails: {
        currency: t('dummy-content.business.currency'),
        price: 1,
        priceText: '',
        minCharge: 0,
        isFree: false,
        paymentType: PaymentType.ONLINE,
        displayTextForPlan: '',
      },
    },
  };

  return {
    services: [service],
    businessInfo: {
      language: config.language,
      currency: t('dummy-content.business.currency'),
      timeZone: t('dummy-content.business.timeZone'),
      timezoneProperties: {
        defaultTimezone: TimezoneType.BUSINESS,
        clientCanChooseTimezone: true,
      },
      regionalSettingsLocale: t(
        'dummy-content.business.regionalSettingsLocale',
      ),
    },
    activeFeatures: {
      applicableForCourse: true,
      bookingsStaffLimit: 1,
      applicableForServiceList: true,
      applicableForGroups: true,
      applicableForIndividual: true,
      applicableForPayments: true,
      applicableForReminders: true,
      applicableForSmsReminders: true,
    },
  };
}
