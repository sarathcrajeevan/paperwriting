/* eslint-disable import/no-cycle */
import _ from 'lodash';
import {
  FilterConfigType,
  FilterType,
  FilterTypeForFetch,
  IDeprecatedFilterConfigDTO,
  IFilterConfig,
  IFilterConfigDTO,
  IFilterOption,
  IGalleryStyleParams,
} from '../types/galleryTypes';
import {MultilingualService} from '@wix/wixstores-client-storefront-sdk/dist/es/src/services/MultilingualService/MultilingualService';

export class FilterConfigsService {
  private filterConfigs: IFilterConfig[];

  constructor(
    private filterConfigDTOs: IFilterConfigDTO[] | undefined,
    private readonly deprecatedFilterConfigDTOs: IDeprecatedFilterConfigDTO[] | undefined,
    private readonly sdkBooleans: IGalleryStyleParams['booleans'],
    private readonly multilingualService: MultilingualService,
    private readonly translations: {[key: string]: string}
  ) {
    if (!this.areFilterConfigsSavedInSdkBooleans) {
      this.initFilterConfigs();
    }
  }

  public getFilterTypeDTOs(): FilterTypeForFetch[] {
    let filterTypeDTOs: FilterTypeForFetch[] = [];

    if (!this.areFilterConfigsSavedInSdkBooleans) {
      filterTypeDTOs = this.filterConfigs.map((filterConfig) => {
        return this.convertToFilterTypeDTO(filterConfig);
      });
    } else {
      this.sdkBooleans.galleryFiltersCategories && filterTypeDTOs.push(FilterTypeForFetch.CATEGORY);
      this.sdkBooleans.galleryFiltersPrice && filterTypeDTOs.push(FilterTypeForFetch.PRICE);
      this.sdkBooleans.galleryFiltersProductOptions && filterTypeDTOs.push(FilterTypeForFetch.OPTIONS);
    }
    return _.uniq(filterTypeDTOs);
  }

  public getFilterConfigTitle(
    filterType: FilterType.COLLECTION | FilterType.PRICE | FilterType.CUSTOM_COLLECTION
  ): string {
    const filterConfigType = this.convertToFilterConfigType(filterType);
    if (!this.areFilterConfigsSavedInSdkBooleans) {
      return this.filterConfigs.find((fc) => fc.filterType === filterConfigType).filterTitle;
    } else {
      return this.getDefaultFilterTitle(filterConfigType);
    }
  }

  public getCustomCollectionFilterConfigs(): IFilterConfig[] {
    return this.filterConfigs.filter((fc) => fc.custom);
  }

  public getCollectionFilterConfigs(): IFilterConfig[] {
    if (!this.areFilterConfigsSavedInSdkBooleans) {
      return this.filterConfigs.filter((fc) => fc.filterType === FilterConfigType.CATEGORY && !fc.custom);
    } else {
      return [];
    }
  }

  public shouldShowFilters(): boolean {
    if (!this.areFilterConfigsSavedInSdkBooleans) {
      return this.filterConfigs.length !== 0;
    } else {
      return (
        this.sdkBooleans.galleryFiltersCategories ||
        this.sdkBooleans.galleryFiltersPrice ||
        this.sdkBooleans.galleryFiltersProductOptions
      );
    }
  }

  public getEnabledFilterOptionsFromFilterConfig(
    filterOptions: IFilterOption[],
    filterConfig: IFilterConfig
  ): IFilterOption[] {
    return filterOptions
      .filter((filterOption) => this.getEnabledFilterOptions(filterOption, filterConfig))
      .sort((fo1, fo2) => this.sortCollections(fo1, fo2, filterConfig));
  }

  public removeCustomCollectionFiltersWithNoOptions(filterOptions: IFilterOption[]): void {
    _.remove(this.filterConfigs, (filterConfig) => {
      return (
        filterConfig.filterType === this.convertToFilterConfigType(FilterType.CUSTOM_COLLECTION) &&
        this.getEnabledFilterOptionsFromFilterConfig(filterOptions, filterConfig).length === 0
      );
    });
  }

  private getEnabledFilterOptions(filterOption: IFilterOption, filterConfig) {
    return !!_.find(filterConfig.selected, {id: filterOption.key});
  }

  private sortCollections(fo1: IFilterOption, fo2: IFilterOption, filterConfig) {
    return _.findIndex(filterConfig.selected, {id: fo1.key}) - _.findIndex(filterConfig.selected, {id: fo2.key});
  }

  private convertToFilterTypeDTO(filterConfig: IFilterConfig): FilterTypeForFetch {
    if (filterConfig.custom) {
      return FilterTypeForFetch.FILTERED_CATEGORIES;
    }

    switch (filterConfig.filterType) {
      case FilterConfigType.CATEGORY:
        return FilterTypeForFetch.CATEGORY;
      case FilterConfigType.PRICE:
        return FilterTypeForFetch.PRICE;
      case FilterConfigType.OPTIONS:
        return FilterTypeForFetch.OPTIONS;
    }
  }

  private convertToFilterConfigType(filterType: FilterType): FilterConfigType {
    switch (filterType) {
      case FilterType.COLLECTION:
        return FilterConfigType.CATEGORY;
      case FilterType.CUSTOM_COLLECTION:
        return FilterConfigType.OPTION_LIST;
      case FilterType.PRICE:
        return FilterConfigType.PRICE;
    }
  }

  private initFilterConfigs() {
    const filterConfigs = this.filterConfigDTOs
      ? this.toFilterConfigs(this.filterConfigDTOs)
      : this.deprecatedFilterConfigDTOs;
    this.filterConfigs = filterConfigs.filter((fc) => fc.show === true);
  }

  private toFilterConfigs(filterConfigDTOs: IFilterConfigDTO[]): IFilterConfig[] {
    return filterConfigDTOs.map((fcDTO) => ({
      ...fcDTO,
      filterTitle: this.getFilterTitle(fcDTO),
    }));
  }

  private getFilterTitle(filterConfigDTO: IFilterConfigDTO): string {
    return (
      this.multilingualService.get(filterConfigDTO.id) ||
      (filterConfigDTO as any).filterTitle ||
      this.getDefaultFilterTitle(filterConfigDTO.filterType)
    );
  }

  private getDefaultFilterTitle(filterType: FilterConfigType): string {
    switch (filterType) {
      case FilterConfigType.CATEGORY:
        return this.translations['gallery.filters.filterList.items.collection.label'];
      case FilterConfigType.PRICE:
        return this.translations['gallery.filters.filterList.items.price.label'];
      case FilterConfigType.OPTIONS:
        return this.translations['gallery.filters.filterList.items.productOptions.label'];
      case FilterConfigType.OPTION_LIST:
        return this.translations['gallery.filters.filterList.items.custom.label'];
    }
  }

  private get areFilterConfigsSavedInSdkBooleans(): boolean {
    return !this.filterConfigDTOs && !this.deprecatedFilterConfigDTOs;
  }

  public setFilterConfigDTOs(config: IFilterConfigDTO[]): void {
    this.filterConfigDTOs = config;
    this.initFilterConfigs();
  }
}
