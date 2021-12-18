import { OfferingType, BOOKINGS_APP_DEF_ID } from '@wix/bookings-uou-domain';
import { OfferingIntent } from '../../../platform/navigation/navigation.const';

export enum TrackingConst {
  CLICK_PRODUCT = 'ClickProduct',
  INITIATE_CHECKOUT = 'InitiateCheckout',
}

export const EVENT_ORIGIN_BOOKINGS = 'Bookings';

const track = (eventId, payload, isEditorMode: boolean, trackEventFunc) => {
  if (!isEditorMode) {
    trackEventFunc(eventId, {
      origin: EVENT_ORIGIN_BOOKINGS,
      appDefId: BOOKINGS_APP_DEF_ID,
      ...payload,
    });
  }
};

export const trackOfferingClickFromWidget = (
  offering,
  position,
  isEditorMode,
  businessName,
  trackEventFunc,
) => {
  trackOfferingClick(
    offering,
    position,
    'Service Widget',
    isEditorMode,
    businessName,
    trackEventFunc,
  );
};

export const trackOfferingBookingClick = (
  offering: any,
  businessName: string,
  isEditorMode: boolean,
  trackEventFunc,
) => {
  track(
    TrackingConst.INITIATE_CHECKOUT,
    {
      contents: [getTrackingEventOfferingFromOffering(offering, businessName)],
    },
    isEditorMode,
    trackEventFunc,
  );
};

const getVariant = (offeringType) =>
  offeringType === OfferingType.INDIVIDUAL
    ? 'PRIVATE'
    : offeringType === OfferingType.GROUP
    ? 'GROUP'
    : 'COURSE';

const getTrackingEventOfferingFromOffering = (
  offering: any,
  businessName: string,
) => ({
  id: offering.id,
  name: offering.info.name,
  brand: businessName,
  category: '',
  variant: getVariant(offering.type),
  price: offering.payment.price,
  currency: offering.payment.currency,
});

const trackOfferingClick = (
  offering: any,
  position: number,
  viewSource: string,
  isEditorMode: boolean,
  businessName: string,
  trackEventFunc,
) => {
  track(
    TrackingConst.CLICK_PRODUCT,
    {
      name: offering.info.name,
      id: offering.id,
      list: viewSource,
      brand: businessName,
      category: '',
      variant: getVariant(offering.type),
      position,
      price: offering.payment.price,
      currency: offering.payment.currency,
    },
    isEditorMode,
    trackEventFunc,
  );
};

export const logToGoogleAnalytics = (
  intent: string,
  businessName: string,
  offering,
  isEditorMode: boolean,
  trackEventFunc: Function,
) => {
  if (intent === OfferingIntent.BOOK_OFFERING) {
    trackOfferingBookingClick(
      offering,
      businessName,
      isEditorMode,
      trackEventFunc,
    );
  } else {
    trackOfferingClickFromWidget(
      offering,
      0,
      isEditorMode,
      businessName,
      trackEventFunc,
    );
  }
};
