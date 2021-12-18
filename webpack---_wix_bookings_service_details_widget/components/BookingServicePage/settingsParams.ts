import {
  createSettingsParams,
  SettingsParamType,
} from '@wix/yoshi-flow-editor/tpa-settings';
import {
  AlignmentOptions,
  GalleryArrowPositionOptions,
  GalleryItemSizeOptions,
  GalleryLayoutOptions,
  ImagePositionOptions,
  ImageResizeOptions,
  ISection,
  SectionTypes,
  SidebarPosition,
} from './types';
import { AccessibilityHtmlTags } from '../../utils/AccessibilityHtmlTags.const';

export const defaultSections: ISection[] = [
  {
    type: SectionTypes.TITLE_TAGLINE,
    visible: true,
    bookButton: false,
  },
  {
    type: SectionTypes.DETAILS,
    visible: true,
    bookButton: true,
  },
  {
    type: SectionTypes.DESCRIPTION,
    visible: true,
    bookButton: false,
  },
  {
    type: SectionTypes.GALLERY,
    visible: true,
    bookButton: false,
  },
  {
    type: SectionTypes.SCHEDULING,
    visible: true,
    bookButton: true,
  },
  {
    type: SectionTypes.POLICY,
    visible: true,
    bookButton: false,
  },
  {
    type: SectionTypes.CONTACT,
    visible: true,
    bookButton: false,
  },
];

interface DesktopSettingsKeys {
  policySectionTitle: SettingsParamType.String;
  sections: ISection[];
  headerVisibility: SettingsParamType.Boolean;
  headerTitleVisibility: SettingsParamType.Boolean;
  headerTitleAlignment: AlignmentOptions;
  headerImageVisibility: SettingsParamType.Boolean;
  headerImagePosition: ImagePositionOptions;
  headerBookButtonVisibility: SettingsParamType.Boolean;
  sidebarVisibility: SettingsParamType.Boolean;
  onlineBadgeVisibility: SettingsParamType.Boolean;
  onlineBadgeText: SettingsParamType.String;
  serviceTitleVisibility: SettingsParamType.Boolean;
  serviceTaglineVisibility: SettingsParamType.Boolean;
  titleAndTaglineVisibility: SettingsParamType.Boolean;
  detailsDurationVisibility: SettingsParamType.Boolean;
  detailsPriceVisibility: SettingsParamType.Boolean;
  detailsLocationVisibility: SettingsParamType.Boolean;
  detailsBoxAlignment: AlignmentOptions | undefined;
  detailsTextAlignment: AlignmentOptions | undefined;
  detailsButtonAlignment: AlignmentOptions | undefined;
  titleAndTaglineAlignment: AlignmentOptions | undefined;
  businessEmailVisibility: SettingsParamType.Boolean;
  businessPhoneNumberVisibility: SettingsParamType.Boolean;
  businessAddressVisibility: SettingsParamType.Boolean;
  locationNameVisibility: SettingsParamType.Boolean;
  contactDetailsTitleText: SettingsParamType.String;
  descriptionTitleText: SettingsParamType.String;
  bookButtonText: SettingsParamType.String;
  pendingApprovalButtonText: SettingsParamType.String;
  serviceUnavailableMessageText: SettingsParamType.String;
  fullCourseMessageText: SettingsParamType.String;
  unBookableCourseMessageText: SettingsParamType.String;
  bookStartedCourseMessageText: SettingsParamType.String;
  sidebarSection: SectionTypes;
  sidebarFreezePosition: SettingsParamType.Boolean;
  sidebarPosition: SidebarPosition;
  sidebarAlignment: AlignmentOptions;
  bodyAlignment: AlignmentOptions;
  columnPosition: AlignmentOptions;
  scheduleDays: SettingsParamType.Number;
  scheduleSectionTitle: SettingsParamType.String;
  scheduleLoadAllText: SettingsParamType.String;
  scheduleEmptyStateText: SettingsParamType.String;
  scheduleDurationVisibility: SettingsParamType.Boolean;
  scheduleStaffVisibility: SettingsParamType.Boolean;
  showSessionLimit: SettingsParamType.Boolean;
  scheduleSessionLimit: SettingsParamType.Number;
  headerTitleHtmlTag: SettingsParamType.String;
  bodyServiceTitleHtmlTag: SettingsParamType.String;
  bodySectionTitleHtmlTag: SettingsParamType.String;
  sidebarServiceTitleHtmlTag: SettingsParamType.String;
  sidebarTitleHtmlTag: SettingsParamType.String;
  galleryLayout: GalleryLayoutOptions;
  galleryMasonryItemSpacing: SettingsParamType.Number;
  galleryMasonryItemBorderWidth: SettingsParamType.Number;
  galleryMasonryItemRadius: SettingsParamType.Number;
  galleryMasonryItemSize: GalleryItemSizeOptions;
  galleryGridItemSpacing: SettingsParamType.Number;
  galleryGridItemBorderWidth: SettingsParamType.Number;
  galleryGridItemRadius: SettingsParamType.Number;
  galleryGridThumbnailSize: SettingsParamType.Number;
  gallerySliderItemSpacing: SettingsParamType.Number;
  gallerySliderItemBorderWidth: SettingsParamType.Number;
  gallerySliderItemRadius: SettingsParamType.Number;
  gallerySliderImageResizeOption: ImageResizeOptions;
  gallerySliderLoopImages: SettingsParamType.Boolean;
  gallerySliderAutoSlide: SettingsParamType.Boolean;
  gallerySliderTimeBetweenImages: SettingsParamType.Number;
  gallerySliderShowArrows: SettingsParamType.Boolean;
  gallerySliderArrowsSize: SettingsParamType.Number;
  gallerySliderArrowsPosition: GalleryArrowPositionOptions;
  gallerySliderHeight: SettingsParamType.Number;
  buttonsFullWidth: SettingsParamType.Boolean;
}

interface MobileSettingsKeys {
  mobileSections: SectionTypes[] | undefined;
}

export default createSettingsParams<DesktopSettingsKeys & MobileSettingsKeys>({
  sections: {
    type: SettingsParamType.Object,
    getDefaultValue: () => defaultSections,
  },
  headerVisibility: {
    getDefaultValue: () => true,
  },
  headerTitleVisibility: {
    getDefaultValue: () => false,
  },
  headerTitleAlignment: {
    getDefaultValue: (): AlignmentOptions => AlignmentOptions.CENTER,
  },
  headerImageVisibility: {
    getDefaultValue: () => true,
  },
  headerImagePosition: {
    getDefaultValue: () => ImagePositionOptions.MIDDLE,
  },
  headerBookButtonVisibility: {
    getDefaultValue: () => false,
  },
  sidebarVisibility: {
    getDefaultValue: () => false,
  },
  sidebarSection: {
    getDefaultValue: () => SectionTypes.CONTACT,
  },
  sidebarFreezePosition: {
    getDefaultValue: () => false,
  },
  sidebarPosition: {
    getDefaultValue: ({ isRTL }) =>
      isRTL ? SidebarPosition.LEFT : SidebarPosition.RIGHT,
  },
  sidebarAlignment: {
    getDefaultValue: ({ isRTL }): AlignmentOptions =>
      isRTL ? AlignmentOptions.RIGHT : AlignmentOptions.LEFT,
  },
  onlineBadgeVisibility: {
    getDefaultValue: () => true,
  },
  serviceTitleVisibility: {
    getDefaultValue: () => true,
  },
  titleAndTaglineVisibility: {
    getDefaultValue: () => true,
  },
  serviceTaglineVisibility: {
    getDefaultValue: () => true,
  },
  titleAndTaglineAlignment: {
    getDefaultValue: () => undefined,
  },
  policySectionTitle: {
    getDefaultValue: () => '',
  },
  detailsDurationVisibility: {
    getDefaultValue: () => true,
  },
  detailsPriceVisibility: {
    getDefaultValue: () => true,
  },
  detailsLocationVisibility: {
    getDefaultValue: () => true,
  },
  detailsBoxAlignment: {
    getDefaultValue: () => undefined,
  },
  detailsTextAlignment: {
    getDefaultValue: () => undefined,
  },
  detailsButtonAlignment: {
    getDefaultValue: () => undefined,
  },
  businessEmailVisibility: {
    getDefaultValue: () => true,
  },
  businessPhoneNumberVisibility: {
    getDefaultValue: () => true,
  },
  businessAddressVisibility: {
    getDefaultValue: () => true,
  },
  locationNameVisibility: {
    getDefaultValue: () => false,
  },
  contactDetailsTitleText: {
    getDefaultValue: () => '',
  },
  descriptionTitleText: {
    getDefaultValue: () => '',
  },
  onlineBadgeText: {
    getDefaultValue: () => '',
  },
  bookButtonText: {
    getDefaultValue: () => '',
  },
  pendingApprovalButtonText: {
    getDefaultValue: () => '',
  },
  serviceUnavailableMessageText: {
    getDefaultValue: () => '',
  },
  fullCourseMessageText: {
    getDefaultValue: () => '',
  },
  unBookableCourseMessageText: {
    getDefaultValue: () => '',
  },
  bookStartedCourseMessageText: {
    getDefaultValue: () => '',
  },
  bodyAlignment: {
    getDefaultValue: ({ isRTL }): AlignmentOptions =>
      isRTL ? AlignmentOptions.RIGHT : AlignmentOptions.LEFT,
  },
  columnPosition: {
    getDefaultValue: (): AlignmentOptions => AlignmentOptions.CENTER,
  },
  scheduleDays: {
    getDefaultValue: () => 7,
  },
  scheduleSectionTitle: {
    getDefaultValue: () => '',
  },
  scheduleLoadAllText: {
    getDefaultValue: () => '',
  },
  scheduleEmptyStateText: {
    getDefaultValue: () => '',
  },
  scheduleDurationVisibility: {
    getDefaultValue: () => true,
  },
  scheduleStaffVisibility: {
    getDefaultValue: () => true,
  },
  showSessionLimit: {
    getDefaultValue: () => true,
  },
  scheduleSessionLimit: {
    getDefaultValue: () => 3,
  },
  headerTitleHtmlTag: {
    getDefaultValue: () => AccessibilityHtmlTags.MainHeader,
  },
  sidebarServiceTitleHtmlTag: {
    getDefaultValue: () => AccessibilityHtmlTags.MainHeader,
  },
  bodyServiceTitleHtmlTag: {
    getDefaultValue: () => AccessibilityHtmlTags.MainHeader,
  },
  bodySectionTitleHtmlTag: {
    getDefaultValue: () => AccessibilityHtmlTags.SecondaryHeader,
  },
  sidebarTitleHtmlTag: {
    getDefaultValue: () => AccessibilityHtmlTags.SecondaryHeader,
  },
  galleryLayout: {
    getDefaultValue: () => GalleryLayoutOptions.SLIDER,
  },
  galleryMasonryItemSize: {
    getDefaultValue: () => GalleryItemSizeOptions.MEDIUM,
  },
  galleryMasonryItemSpacing: {
    getDefaultValue: () => 12,
    inheritDesktop: false,
  },
  galleryMasonryItemBorderWidth: {
    getDefaultValue: () => 0,
  },
  galleryMasonryItemRadius: {
    getDefaultValue: () => 0,
  },
  galleryGridThumbnailSize: {
    getDefaultValue: ({ isMobile }) => (isMobile ? 200 : 400),
    inheritDesktop: false,
  },
  galleryGridItemSpacing: {
    getDefaultValue: () => 12,
    inheritDesktop: false,
  },
  galleryGridItemBorderWidth: {
    getDefaultValue: () => 0,
  },
  galleryGridItemRadius: {
    getDefaultValue: () => 0,
  },
  gallerySliderItemSpacing: {
    getDefaultValue: () => 12,
    inheritDesktop: false,
  },
  gallerySliderItemBorderWidth: {
    getDefaultValue: () => 0,
  },
  gallerySliderItemRadius: {
    getDefaultValue: () => 0,
  },
  gallerySliderImageResizeOption: {
    getDefaultValue: () => ImageResizeOptions.FIT,
  },
  gallerySliderTimeBetweenImages: {
    getDefaultValue: () => 4,
  },
  gallerySliderLoopImages: {
    getDefaultValue: () => true,
  },
  gallerySliderAutoSlide: {
    getDefaultValue: () => false,
  },
  gallerySliderShowArrows: {
    getDefaultValue: () => true,
  },
  gallerySliderArrowsSize: {
    getDefaultValue: ({ isMobile }) => (isMobile ? 18 : 16),
    inheritDesktop: false,
  },
  gallerySliderArrowsPosition: {
    getDefaultValue: ({ isMobile }) =>
      isMobile
        ? GalleryArrowPositionOptions.INSIDE
        : GalleryArrowPositionOptions.OUTSIDE,
    inheritDesktop: false,
  },
  gallerySliderHeight: {
    getDefaultValue: ({ isMobile }) => (isMobile ? 200 : 400),
    inheritDesktop: false,
  },
  buttonsFullWidth: {
    getDefaultValue: () => false,
    inheritDesktop: false,
  },
  mobileSections: {
    type: SettingsParamType.Object,
    getDefaultValue: () => undefined,
  },
});
