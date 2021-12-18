/* eslint-disable array-callback-return */
/* eslint-disable import/no-cycle */
import {
  FilterModel,
  FilterType,
  FilterTypeFromFetch,
  ICollectionIdsFilterDTO,
  IFilterDTO,
  IFilterModel,
  IFilterSelectionValue,
  IQueryParamsFilter,
  nonCollectionFilterModel,
} from '../types/galleryTypes';
import {ColorFilterModel} from '../models/ColorFilterModel';
import {ListFilterModel} from '../models/ListFilterModel';
import {PriceFilterModel} from '../models/PriceFilterModel';
import {CollectionFiltersService} from '../services/CollectionFiltersService';
import {FilterConfigsService} from '../services/FilterConfigsService';
import {FiltersApi} from '../api/FiltersApi';
import {SiteStore} from '@wix/wixstores-client-storefront-sdk/dist/es/src/viewer-script/site-store/SiteStore';
import {IFilter} from '@wix/wixstores-graphql-schema/dist/src/graphql-schema';
import _ from 'lodash';
import {CollectionFilterModel} from '../models/CollectionFilterModel';
import {CustomCollectionFilterModel} from '../models/CustomCollectionFilterModel';
import {GetFiltersQuery, ProductFilters} from '../graphql/queries-schema';
import {IFilterValue} from '@wix/wixstores-graphql-schema/dist/es/src';
import {DEFAULT_COLLECTION_ID} from '../constants';

export class FiltersService {
  private filterModels: FilterModel[] = [];
  private readonly collectionFiltersService: CollectionFiltersService;
  private readonly filtersApi: FiltersApi;
  private snapshot = [];

  constructor(
    siteStore: SiteStore,
    private readonly mainCollectionId: string,
    private readonly filterConfigsService: FilterConfigsService
  ) {
    this.collectionFiltersService = new CollectionFiltersService(this.mainCollectionId, this.filterConfigsService);
    this.filtersApi = new FiltersApi(siteStore);
  }

  public async fetchFilters(): Promise<FilterModel[]> {
    const filterTypeDTOs = this.filterConfigsService.getFilterTypeDTOs();
    const filtersResponse = await this.filtersApi.getFilters(filterTypeDTOs, this.mainCollectionId);
    const filters = this.removeCollectionFiltersWithNoOptions(filtersResponse.data.catalog.filters);
    this.removeCustomCollectionFiltersWithNoOptions(filtersResponse.data.catalog.filters);
    this.filterModels = this.sortFilterModels(this.createFilterModels(filters));
    return this.filterModels;
  }

  public updateActiveFilterOptionsByQueryParams(queryParamsFilters: IQueryParamsFilter[]): void {
    for (const queryParamFilter of queryParamsFilters) {
      const delimiter = /,|\|/g;
      const queryParamsValues = queryParamFilter.value.split(delimiter);

      this.filterModels.forEach((filterModel) => {
        if (filterModel.filterId === queryParamFilter.filterId) {
          const activeFilterOption = this.getActiveFiltersOptionInFilterModelFromQueryPrams(
            queryParamsValues,
            filterModel
          );
          if (activeFilterOption) {
            this.updateActiveFilterOptionByQueryParams(filterModel, queryParamFilter, activeFilterOption);
          }
        }
      });
    }
  }

  public updateActiveFilterOption(filterId: number, selectionValue: IFilterSelectionValue): void {
    const filterModel = this.getFilterModel(filterId);
    filterModel.updateActiveOptions(selectionValue);
  }

  public getFilterModels(): FilterModel[] {
    return this.filterModels;
  }

  public getFilterModel(filterId: number): IFilterModel {
    return this.filterModels.find((fm) => fm.filterId === filterId) as IFilterModel;
  }

  public getFilterDTO = (): ProductFilters => {
    const selectedFilterDTOs = this.getFilterDTOs();

    if (!selectedFilterDTOs.length) {
      return null;
    }

    return {
      and: selectedFilterDTOs.map((filter) => {
        return {
          term: filter,
        };
      }),
    } as any;
  };

  public shouldSpecificCollectionQuery = (mainCollectionId: string): boolean => {
    if (mainCollectionId !== DEFAULT_COLLECTION_ID || this.getNonCollectionFilterDTOs().length) {
      return false;
    }
    const collectionDTOs = this.getCollectionFilterDTOs();
    if (collectionDTOs.length !== 1) {
      return false;
    }
    return this.collectionFiltersService.shouldSpecificCollectionQuery(collectionDTOs[0]);
  };

  public getCollectionIdsFilterDTO(): ICollectionIdsFilterDTO {
    const collectionIdsFilter: ICollectionIdsFilterDTO = {mainCategory: this.mainCollectionId};

    if (
      this.isFilterModelExists(FilterType.COLLECTION) &&
      this.getSelectedCollectionFilterId() !== this.mainCollectionId
    ) {
      collectionIdsFilter.subCategory = this.getSelectedCollectionFilterId();
    }

    if (this.hasSelectedCustomCollectionIds()) {
      const selectedCustomCollections = this.collectionFiltersService.getSelectedCustomCollectionFilters();
      collectionIdsFilter.customCategories = selectedCustomCollections.map(
        (selectedCollection) => selectedCollection.activeOptions
      );
    }

    return collectionIdsFilter;
  }

  public resetFilters(): void {
    this.filterModels.forEach((fm) => {
      fm.resetActiveOptions();
    });
  }

  public updateSnapshotWithActiveOptions(): void {
    this.snapshot = this.filterModels.map((fm) => _.cloneDeep(fm.activeOptions));
  }

  public updateActiveOptionsWithSnapshot(): void {
    this.snapshot.forEach((activeOptions, i) => {
      this.filterModels[i].activeOptions = _.cloneDeep(activeOptions);
    });
  }

  public shouldShowClearFilters(): boolean {
    return !this.isOnlyMainCollectionFilterSelected();
  }

  public getSelectedFilterTypes(): string[] {
    const filterTypes = this.filterModels.filter((fm) => fm.hasActiveOptions()).map((fm) => fm.filterType);
    const collectionFilterModel = this.filterModels.filter(
      (fm) => fm.filterType === FilterType.COLLECTION
    )[0] as CollectionFilterModel;

    if (this.isOnlyMainCollectionFilterSelected()) {
      return [];
    }
    if (collectionFilterModel?.isDefaultOptionSelected()) {
      filterTypes.splice(filterTypes.indexOf(FilterType.COLLECTION), 1);
    }

    return filterTypes;
  }

  public isOnlyMainCollectionFilterSelected(): boolean {
    return (
      this.getFilterDTOs().length === 0 ||
      (this.getFilterDTOs().length === 1 &&
        _.isEqual(this.collectionFiltersService.getMainCollectionFilterDTO(), this.getFilterDTOs()[0]))
    );
  }

  public deleteFilterModels(): void {
    this.filterModels = [];
  }

  private getActiveFiltersOptionInFilterModelFromQueryPrams(
    queryParamsValues: string[],
    filterModel: FilterModel
  ): IFilterValue | IFilterValue[] {
    if (queryParamsValues.length > 1) {
      return queryParamsValues.map((val) => {
        if (filterModel.filterType === FilterType.PRICE) {
          return filterModel.options.find((option) => {
            return option.key === val;
          });
        } else {
          return filterModel.options.find((option) => {
            return option.value === val;
          });
        }
      });
    } else if (queryParamsValues[0] === 'All') {
      return {key: this.mainCollectionId, value: queryParamsValues[0]};
    } else {
      return filterModel.options.find((option) => {
        return option.value === queryParamsValues[0];
      });
    }
  }

  private updateActiveFilterOptionByQueryParams(
    filterModel: IFilterModel,
    queryParamFilter: IQueryParamsFilter,
    activeFilterOption: IFilterValue | IFilterValue[]
  ): void {
    switch (filterModel.filterType) {
      case FilterType.LIST_OPTION:
      case FilterType.CUSTOM_COLLECTION:
      case FilterType.COLOR_OPTION: {
        if (_.isArray(activeFilterOption)) {
          for (const filterOption of activeFilterOption) {
            if (filterOption) {
              this.updateActiveFilterOption(queryParamFilter.filterId, filterOption.key);
            }
          }
        } else {
          this.updateActiveFilterOption(queryParamFilter.filterId, activeFilterOption.key);
        }
        break;
      }
      case FilterType.COLLECTION: {
        this.updateActiveFilterOption(queryParamFilter.filterId, (activeFilterOption as IFilterValue).key);
        break;
      }
      case FilterType.PRICE: {
        if (activeFilterOption[0] && activeFilterOption[1]) {
          this.updateActiveFilterOption(queryParamFilter.filterId, {
            min: activeFilterOption[0].key,
            max: activeFilterOption[1].key,
          });
        }
      }
    }
  }

  private getFilterDTOs(): IFilterDTO[] {
    const filterDTOs = [];

    const collectionDTOs = this.getCollectionFilterDTOs();
    const nonCollectionDTOs = this.getNonCollectionFilterDTOs();

    filterDTOs.push(...collectionDTOs);
    filterDTOs.push(...nonCollectionDTOs);

    return filterDTOs;
  }

  private getSelectedCollectionFilterId(): string {
    return (this.getFilterModelByType(FilterType.COLLECTION)[0] as CollectionFilterModel).activeOptions;
  }

  private hasSelectedCustomCollectionIds(): boolean {
    let result = false;

    const customCollectionFilterModels = this.getFilterModelByType(
      FilterType.CUSTOM_COLLECTION
    ) as CustomCollectionFilterModel[];

    customCollectionFilterModels.forEach((fm) => {
      if (fm.hasActiveOptions()) {
        result = true;
      }
    });

    return result;
  }

  private getFilterModelByType(filterType: FilterType): FilterModel[] {
    return this.filterModels.filter((fm) => fm.filterType === filterType);
  }

  private createFilterModels(filters: IFilter[]): FilterModel[] {
    const assignFilterId = (filterModel, index) => {
      filterModel.filterId = index;
      return filterModel;
    };

    const flatten = (acc: FilterModel[], curr) => acc.concat(curr as FilterModel[]);

    return filters
      .map((filter) => {
        switch (filter.filterType) {
          case FilterTypeFromFetch.CATEGORY: {
            return this.collectionFiltersService.createCollectionFilterModel(FilterType.COLLECTION, filter.values);
          }
          case FilterTypeFromFetch.FILTERED_CATEGORIES: {
            return this.collectionFiltersService.createCustomCollectionFilterModels(
              FilterType.CUSTOM_COLLECTION,
              filter.values
            );
          }
          case FilterTypeFromFetch.COLOR: {
            return new ColorFilterModel(FilterType.COLOR_OPTION, filter.name, filter.values, filter.field);
          }
          case FilterTypeFromFetch.LIST: {
            return new ListFilterModel(FilterType.LIST_OPTION, filter.name, filter.values, filter.field);
          }
          case FilterTypeFromFetch.PRICE: {
            const title = this.filterConfigsService.getFilterConfigTitle(FilterType.PRICE);
            return new PriceFilterModel(FilterType.PRICE, title, filter.values, filter.field);
          }
        }
      })
      .reduce(flatten, [])
      .map(assignFilterId);
  }

  private sortFilterModels(filterModels: FilterModel[]) {
    this.filterModels = this.sortColorAndListFiltersAlphabetically(filterModels);

    const sortingOrder = [
      FilterType.COLLECTION,
      FilterType.PRICE,
      FilterType.COLOR_OPTION,
      FilterType.LIST_OPTION,
      FilterType.CUSTOM_COLLECTION,
    ];

    return _.sortBy(this.filterModels, (fm) => {
      return sortingOrder.indexOf(fm.filterType);
    });
  }

  private sortColorAndListFiltersAlphabetically(filterModels: FilterModel[]) {
    return _.sortBy(filterModels, (fm) => {
      if (fm.filterType === FilterType.COLOR_OPTION || fm.filterType === FilterType.LIST_OPTION) {
        return fm.title;
      }
    });
  }

  private isCollectionFilter(filter: FilterModel): boolean {
    return filter.filterType === FilterType.CUSTOM_COLLECTION || filter.filterType === FilterType.COLLECTION;
  }

  private getCollectionFilterDTOs(): IFilterDTO[] {
    return this.collectionFiltersService.toDTOs();
  }

  private getNonCollectionFilterDTOs(): IFilterDTO[] {
    const nonCollectionFilterModels = this.filterModels.filter((fm) => !this.isCollectionFilter(fm));
    return nonCollectionFilterModels
      .filter((fm: nonCollectionFilterModel) => fm.hasActiveOptions())
      .map((fm: nonCollectionFilterModel) => fm.toDTO());
  }

  private removeCollectionFiltersWithNoOptions(filters: GetFiltersQuery['catalog']['filters']): IFilter[] {
    _.remove(filters, (filter) => {
      return (
        filter.filterType === FilterTypeFromFetch.CATEGORY &&
        this.collectionFiltersService.getEnabledCollectionFilterOptions(filter.values).length === 0
      );
    });

    return filters;
  }

  private removeCustomCollectionFiltersWithNoOptions(filters: GetFiltersQuery['catalog']['filters']): void {
    const customCollectionFilter = filters.find((f) => f.filterType === FilterTypeFromFetch.FILTERED_CATEGORIES);
    if (customCollectionFilter) {
      this.filterConfigsService.removeCustomCollectionFiltersWithNoOptions(customCollectionFilter.values);
    }
  }

  private isFilterModelExists(filterType: FilterType): boolean {
    return !!this.filterModels.find((fm) => fm.filterType === filterType);
  }
}
