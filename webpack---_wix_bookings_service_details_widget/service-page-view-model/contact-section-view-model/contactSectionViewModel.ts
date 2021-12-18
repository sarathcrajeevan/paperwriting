import { BusinessInfo, ServiceInfoDto } from '@wix/bookings-uou-types/dist/src';
import { ServiceLocationType } from '@wix/bookings-uou-types/dist/src/service-location.dto';

export interface ContactSectionViewModel {
  phone?: string;
  email?: string;
  address?: string;
  contactInfo?: ContactInfoViewModel[];
}

export interface ContactInfoViewModel {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
}

export const contactSectionViewModelFactory = ({
  businessInfo,
  serviceInfo,
}: {
  businessInfo?: BusinessInfo;
  serviceInfo?: ServiceInfoDto;
}): ContactSectionViewModel => {
  const locations = serviceInfo?.locations?.filter(
    (location) =>
      location.type === ServiceLocationType.OWNER_BUSINESS &&
      location.businessLocation,
  );

  if (locations?.length) {
    const contactInfo = locations.map((location) => {
      const businessLocation = location.businessLocation;
      return {
        name: businessLocation?.name,
        phone: businessLocation?.phone,
        email: businessLocation?.email,
        address: businessLocation?.address?.formattedAddress,
      };
    });
    return { contactInfo };
  }
  return {
    phone: businessInfo?.phone,
    email: businessInfo?.email,
    address: businessInfo?.address,
  };
};
