import {
  CatalogServiceDto,
  ServiceType,
  ServiceLocation,
} from '@wix/bookings-uou-types';
import { AdditionalBiProps } from '../../WidgetApp/adapters/reporting/bi-logger/bi-logger';
import { OfferingCategoryDto } from '@wix/bookings-uou-domain';

export enum FilterType {
  SPECIFIC = 'SPECIFIC',
  ALL = 'ALL',
  FIRST = 'FIRST',
}

export interface SelectedResources {
  categories?: string[];
  offerings?: string[];
  filter: FilterType;
}

export enum FilterByOptions {
  BY_SERVICES = 'BY_SERVICES',
  BY_LOCATIONS = 'BY_LOCATIONS',
}

export interface SettingsOffering {
  id: string;
  name: string;
  type: ServiceType;
  categoryId: string;
  image: any;
  isNoBookFlow: boolean;
  isPendingApprovalFlow: boolean;
  isSelected: boolean;
}

export interface SettingsCategory {
  id: string;
  name: string;
  isSelected: boolean;
  offeringList: SettingsOffering[];
}

export const CACHE_MAX_AGE_IN_SECONDS = 7 * 24 * 60 * 60; // 7 days
export const CACHE_MAX_AGE_IN_MILLIS = CACHE_MAX_AGE_IN_SECONDS * 1000;

export interface Metadata {
  timings: {
    start: string;
    end: string;
  };
  cacheInfo?: {
    isCachedResponse: boolean;
    maxAge: number;
    cacheInvalidateDate: string;
    cacheInvalidateCause: 'SERVICE' | 'MAX_AGE';
    cacheInvalidateInfo: any;
  };
}

export interface WidgetData {
  offerings: CatalogServiceDto[];
  categories: OfferingCategoryDto[];
  locations: ServiceLocation[];
  config: WidgetConfig;
  metadata?: Metadata;
}

export interface WidgetConfig {
  resourcesFiltered?: boolean;
  baseUrl?: string;
  locale?: string;
  regionalSettings?: string;
  staticBaseUrl?: string;
  activeFeatures: any;
  businessInfo: any;
  experiments?: any;
  settings?: any;
  biProps?: AdditionalBiProps;
}
