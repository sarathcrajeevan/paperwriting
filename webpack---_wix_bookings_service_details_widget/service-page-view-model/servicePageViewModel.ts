import { BodyViewModelBuilder } from './builders/BodyViewModel.builder';
import { WidgetConfig } from '../types/shared-types';
import {
  TitleAndTaglineViewModel,
  titleAndTaglineViewModelFactory,
} from './title-and-tagline-view-model/titleAndTaglineViewModel';
import {
  ContactSectionViewModel,
  contactSectionViewModelFactory,
} from './contact-section-view-model/contactSectionViewModel';
import {
  DetailsSectionViewModel,
  detailsSectionViewModelFactory,
} from './details-section-view-model/detailsSectionViewModel';
import {
  HeaderViewModel,
  headerViewModelFactory,
} from './header-view-model/headerViewModel';
import {
  DescriptionSectionViewModel,
  descriptionSectionViewModelFactory,
} from './description-section-view-modal/descriptionSectionViewModel';
import { HeaderViewModelBuilder } from './builders/HeaderViewModel.builder';
import { TitleAndTaglineViewModelBuilder } from './builders/TitleAndTaglineViewModel.builder';
import { DetailsSectionViewModelBuilder } from './builders/DetailsSectionViewModel.builder';
import { ContactSectionViewModelBuilder } from './builders/ContactSectionViewModel.builder';
import { DescriptionSectionViewModelBuilder } from './builders/DescriptionSectionViewModel.builder';
import {
  ConferencePlatform,
  ServiceType,
} from '@wix/bookings-uou-types/dist/src';
import {
  PolicySectionViewModel,
  policySectionViewModelFactory,
} from './policy-section-view-model/policySectionViewModel';
import { PolicySectionViewModelBuilder } from './builders/PolicySectionViewModel.builder';
import {
  BodyViewModel,
  bodyViewModelFactory,
} from './body-view-model/bodyViewModel';
import {
  BookButtonViewModel,
  bookButtonViewModelFactory,
} from './book-button-view-model/bookButtonViewModel';
import {
  GallerySectionViewModel,
  gallerySectionViewModelFactory,
} from './gallery-section-view-model/gallerySectionViewModel';
import { GallerySectionViewModelBuilder } from './builders/GallerySectionViewModel.builder';

export interface ServicePageViewModel {
  header: HeaderViewModel;
  body: BodyViewModel;
  titleAndTagline: TitleAndTaglineViewModel;
  detailsSection: DetailsSectionViewModel;
  contactSection: ContactSectionViewModel;
  descriptionSection: DescriptionSectionViewModel;
  policySection: PolicySectionViewModel;
  gallerySection: GallerySectionViewModel;
  showSchedulingSection: boolean;
  button?: BookButtonViewModel;
}

export const servicePageViewModelFactory = ({
  config,
  t,
  experiments,
  viewTimezone,
  isSEO,
}: {
  config: WidgetConfig;
  t;
  isSEO?: boolean;
  viewTimezone?: string;
  experiments?;
}): ServicePageViewModel => {
  const bookingPolicyDto = config.bookingPolicyDto;
  const serviceDto = config.serviceDto!;
  const businessInfo = config.businessInfo;
  const serviceInfo = serviceDto.info;
  const couseStartedAndBookableExperiment = experiments?.enabled(
    'specs.bookings.CouseStartedAndBookable',
  );
  const isBookingsClientGalleryEnabled = experiments?.enabled(
    'specs.bookings.ClientGallery',
  );
  const isFormatTimezoneDateByBOConfigurationOnClientSide = experiments?.enabled(
    'specs.bookings.FormatTimezoneDateByBOConfigurationOnClientSide',
  );
  const isShowSingleLocationInDetailsSectionEnabled = experiments?.enabled(
    'specs.bookings.showSingleLocationInDetailsSection',
  );
  const body = bodyViewModelFactory({
    bookingPolicyDto,
    serviceDto,
    couseStartedAndBookableExperiment,
  });
  const isBookable = body.isBookable;

  return {
    header: headerViewModelFactory(
      serviceDto,
      isBookable,
      isBookingsClientGalleryEnabled,
      isSEO,
    ),
    body,
    titleAndTagline: titleAndTaglineViewModelFactory(serviceDto),
    detailsSection: detailsSectionViewModelFactory({
      serviceDto,
      businessInfo,
      t,
      isBookable,
      viewTimezone,
      isFormatTimezoneDateByBOConfigurationOnClientSide,
      isShowSingleLocationInDetailsSectionEnabled,
    }),
    contactSection: contactSectionViewModelFactory({
      businessInfo,
      serviceInfo,
    }),
    descriptionSection: descriptionSectionViewModelFactory(
      serviceDto,
      isBookable,
    ),
    policySection: policySectionViewModelFactory(businessInfo),
    showSchedulingSection: serviceDto.type !== ServiceType.INDIVIDUAL,
    button: bookButtonViewModelFactory(serviceDto),
    gallerySection: gallerySectionViewModelFactory(serviceDto?.info),
  };
};

export const dummyViewModelFactory = ({
  t,
  isEditorX,
}): ServicePageViewModel => {
  const title = t('dummy-data.title');
  const tagline = t('dummy-data.tagline');
  const duration = t('dummy-data.duration');
  const price = t('dummy-data.price');
  const location = t('dummy-data.location');
  const description = t('dummy-data.description');
  const policy = t('dummy-data.policy');
  const phone = t('dummy-data.phone');
  const email = t('dummy-data.email');
  const address = t('dummy-data.address');
  const imageUri = isEditorX
    ? '11062b_7f7efcdb410c48c2a65be450de809052~mv2.jpg'
    : '11062b_7344b0fffa9c41e580794c15cea365d5~mv2.jpg';
  const isBookable = true;
  const gallery = isEditorX
    ? [
        {
          fileName: '11062b_1f94cea4fec64357b49a1880bebfd072~mv2.jpg',
          relativeUri: '11062b_1f94cea4fec64357b49a1880bebfd072~mv2.jpg',
          width: 2240,
          height: 1500,
        },
        {
          fileName: '11062b_a8466e6c581e4820b9c32c13e5a7dabb~mv2.jpg',
          relativeUri: '11062b_a8466e6c581e4820b9c32c13e5a7dabb~mv2.jpg',
          width: 2240,
          height: 1500,
        },
        {
          fileName: '11062b_df81c58f2799405ebec3bb5ebb7d6155~mv2.jpg',
          relativeUri: '11062b_df81c58f2799405ebec3bb5ebb7d6155~mv2.jpg',
          width: 2240,
          height: 1500,
        },
        {
          fileName: '11062b_a2e41b4d43ba4c78b7ca7375142a8f38~mv2.jpg',
          relativeUri: '11062b_a2e41b4d43ba4c78b7ca7375142a8f38~mv2.jpg',
          width: 3648,
          height: 4209,
        },
      ]
    : [
        {
          fileName: '11062b_1e99942894b4427fabbd87b9e85cbf95~mv2.jpg',
          relativeUri: '11062b_1e99942894b4427fabbd87b9e85cbf95~mv2.jpg',
          width: 2606,
          height: 1745,
        },
        {
          fileName: '11062b_6ec3e1291f63411b84ce766a74e99608~mv2.jpg',
          relativeUri: '11062b_6ec3e1291f63411b84ce766a74e99608~mv2.jpg',
          width: 2606,
          height: 1745,
        },
        {
          fileName: '11062b_1c4adda107a544c5b89d0c069238eb9a~mv2.jpg',
          relativeUri: '11062b_1c4adda107a544c5b89d0c069238eb9a~mv2.jpg',
          width: 2606,
          height: 1745,
        },
        {
          fileName: '11062b_60d57732a78546119d2524ec64ad12df~mv2.jpg',
          relativeUri: '11062b_60d57732a78546119d2524ec64ad12df~mv2.jpg',
          width: 3648,
          height: 4209,
        },
      ];

  return {
    header: new HeaderViewModelBuilder()
      .withImage({ relativeUri: imageUri, height: 0, width: 0 })
      .withTitle(title)
      .withBookOnlineAllowed(isBookable)
      .build(),
    body: new BodyViewModelBuilder().withBookOnlineAllowed(isBookable).build(),
    titleAndTagline: new TitleAndTaglineViewModelBuilder()
      .withTitle(title)
      .withTagline(tagline)
      .withOnlineProvider(ConferencePlatform.ZOOM)
      .build(),
    detailsSection: new DetailsSectionViewModelBuilder()
      .withDuration(duration)
      .withPrice(price)
      .withLocation(location)
      .withBookOnlineAllowed(isBookable)
      .build(),
    contactSection: new ContactSectionViewModelBuilder()
      .withPhone(phone)
      .withEmail(email)
      .withAddress(address)
      .build(),
    descriptionSection: new DescriptionSectionViewModelBuilder()
      .withDescription(description)
      .withBookOnlineAllowed(isBookable)
      .build(),
    policySection: new PolicySectionViewModelBuilder()
      .withCancellationPolicy(policy)
      .build(),
    showSchedulingSection: true,
    button: { isPendingApprovalFlow: false },
    gallerySection: new GallerySectionViewModelBuilder()
      .withItems(gallery)
      .build(),
  };
};
