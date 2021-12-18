// https://stackoverflow.com/questions/63961803/eslint-says-all-enums-in-typescript-app-are-already-declared-in-the-upper-scope
/* eslint-disable no-shadow */
export interface ISection {
  type: SectionTypes;
  visible: boolean;
  bookButton?: boolean;
}

export interface CheckboxDto {
  type?: string;
  label: string;
  dataHook?: string;
  value: boolean;
  onChange: Function;
  infoText?: string;
  infoDataHook?: string;
}

export enum SectionTypes {
  DESCRIPTION = 'DESCRIPTION',
  TITLE_TAGLINE = 'TITLE_TAGLINE',
  CONTACT = 'CONTACT',
  DETAILS = 'DETAILS',
  POLICY = 'POLICY',
  SCHEDULING = 'SCHEDULING',
  GALLERY = 'GALLERY',
}

export enum ADISettingsPages {
  MAIN = 'main',
  PAGE_HEADER = 'page-header',
  SERVICE_TITLE = 'service-title',
  SERVICE_DETAILS = 'service-details',
  SERVICE_DESCRIPTION = 'service-description',
  CANCELLATION_POLICY = 'cancellation-policy',
  CONTACT_DETAILS = 'contact-details',
  SERVICE_GALLERY = 'service-gallery',
  SERVICE_SCHEDULE = 'service-schedule',
}

export enum AlignmentOptions {
  LEFT = 'left',
  RIGHT = 'right',
  CENTER = 'center',
  STRETCH = 'stretch',
}

export enum GalleryLayoutOptions {
  SLIDER = 'slider',
  MASONRY = 'masonry',
  GRID = 'grid',
}

export enum GalleryItemSizeOptions {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
}

export enum GalleryArrowPositionOptions {
  INSIDE = 'inside',
  OUTSIDE = 'outside',
}

export enum SidebarPosition {
  LEFT = 'left',
  RIGHT = 'right',
}

export enum SettingsTab {
  Manage = 'Manage',
  Layout = 'Layout',
  Sections = 'Sections',
  Design = 'Design',
  Text = 'Text',
}

export enum helpArticleIds {
  Manage = '13eff5b3-09f3-4d01-9843-efcea79592d0',
  Layout = '1aa194bf-0dab-41fe-b29a-6380ce835abe',
  Sections = 'c60312db-da04-4b03-89c6-466394e6f36d',
  Design = '38a4d79e-961d-4e33-8488-c4d8bb41e693',
  Text = '67fdf5a2-3138-476b-b922-31c59db4842c',
}

export enum ADIHelpArticleIds {
  Main_Page = '153ccfa3-34db-43bc-8eff-63943df55fa6',
  Page_Header_Section = 'bbde3a47-0944-46bb-bff7-5b500bf50ba1',
  Service_Title = '536c055b-0f3d-42ac-beff-e7e4ea1d306e',
  Service_Details_Section = '822b806f-95bc-4784-a601-4bb1986449fa',
  Service_Description_Section = 'f8b1cc91-e1a7-4845-a5df-b0c47216568d',
  Service_Schedule_Section = '4a768132-2f93-4e3c-9130-bc1d53f3cd9f',
  Cancellation_Policy_Section = 'e4d173d6-88f7-4e62-be4f-6d3f2842dafe',
  Contact_Details_Section = '2e6537c2-6fe4-4c99-aeee-fdc06b3cbb57',
}

export enum MainComponents {
  HEADER = 'HEADER',
  BODY = 'BODY',
  SIDEBAR = 'SIDEBAR',
}

export enum ImageResizeOptions {
  CROP = 'crop',
  FIT = 'fit',
}

export enum ImagePositionOptions {
  MIDDLE = 'MIDDLE',
  RIGHT = 'RIGHT',
  LEFT = 'LEFT',
  TOP = 'TOP',
  BOTTOM = 'BOTTOM',
  BOTTOM_RIGHT = 'BOTTOM_RIGHT',
  BOTTOM_LEFT = 'BOTTOM_LEFT',
  TOP_RIGHT = 'TOP_RIGHT',
  TOP_LEFT = 'TOP_LEFT',
}
