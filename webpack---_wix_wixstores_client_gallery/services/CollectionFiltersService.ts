/* eslint-disable import/no-cycle */
import {FilterEqOperation, FilterType, IFilterDTO, IFilterOption} from '../types/galleryTypes';
import {CollectionFilterModel} from '../models/CollectionFilterModel';
import {CustomCollectionFilterModel} from '../models/CustomCollectionFilterModel';
import _ from 'lodash';
import {FilterConfigsService} from './FilterConfigsService';

export class CollectionFiltersService {
  private readonly collectionFilterModels: (CustomCollectionFilterModel | CollectionFilterModel)[] = [];
  private readonly FILTER_FIELD = 'categories';

  constructor(private readonly mainCollectionId: string, private readonly filterConfigsService: FilterConfigsService) {}

  public createCollectionFilterModel(
    filterType: FilterType.COLLECTION,
    filterOptions: IFilterOption[]
  ): CollectionFilterModel {
    const enabledFilterOptions = this.getEnabledCollectionFilterOptions(filterOptions);
    const title = this.filterConfigsService.getFilterConfigTitle(filterType);
    const collectionFilterModel = new CollectionFilterModel(
      filterType,
      title,
      enabledFilterOptions,
      this.mainCollectionId
    );
    this.collectionFilterModels.push(collectionFilterModel);

    return collectionFilterModel;
  }

  public createCustomCollectionFilterModels(
    filterType: FilterType.CUSTOM_COLLECTION,
    filterOptions: IFilterOption[]
  ): CustomCollectionFilterModel[] {
    const customCollectionFilterConfigs = this.filterConfigsService.getCustomCollectionFilterConfigs();

    const customCollectionFilterModels = customCollectionFilterConfigs.map((filterConfig) => {
      const enabledFilterOptions = this.filterConfigsService.getEnabledFilterOptionsFromFilterConfig(
        filterOptions,
        filterConfig
      );
      return new CustomCollectionFilterModel(filterType, filterConfig.filterTitle, enabledFilterOptions);
    });

    this.collectionFilterModels.push(...customCollectionFilterModels);

    return customCollectionFilterModels;
  }

  public toDTOs(): IFilterDTO[] {
    const dtos: IFilterDTO[] = [];
    const selectedCollectionFilters = this.getSelectedCollectionFilters();
    const selectedCustomCollectionFilters = this.getSelectedCustomCollectionFilters();

    selectedCollectionFilters.forEach((selectedFilter) => {
      dtos.push(this.createCollectionDTO(FilterEqOperation.IN_ALL, selectedFilter.activeOptions));
    });

    selectedCustomCollectionFilters.forEach((selectedFilter) => {
      dtos.push(this.createCollectionDTO(FilterEqOperation.IN, selectedFilter.activeOptions));
    });

    return dtos;
  }

  public getMainCollectionFilterDTO(): IFilterDTO {
    return this.createCollectionDTO(FilterEqOperation.IN_ALL, [this.mainCollectionId]);
  }

  public getEnabledCollectionFilterOptions(filterOptions: IFilterOption[]): IFilterOption[] {
    let result = _.cloneDeep(filterOptions);
    const collectionFilterConfigs = this.filterConfigsService.getCollectionFilterConfigs();

    if (collectionFilterConfigs.length !== 0) {
      result = this.filterConfigsService.getEnabledFilterOptionsFromFilterConfig(
        filterOptions,
        collectionFilterConfigs[0]
      );
    }

    return result;
  }

  public getSelectedCustomCollectionFilters(): CustomCollectionFilterModel[] {
    const customCollectionFilterModels = this.collectionFilterModels.filter(
      (fm) => fm.filterType === FilterType.CUSTOM_COLLECTION
    ) as CustomCollectionFilterModel[];

    return customCollectionFilterModels.filter((fm) => fm.hasActiveOptions());
  }

  public shouldSpecificCollectionQuery(filter: IFilterDTO): boolean {
    return filter.field === this.FILTER_FIELD && filter.op === FilterEqOperation.IN_ALL && filter.values.length === 1;
  }

  private getSelectedCollectionFilters(): CollectionFilterModel[] {
    const collectionFilterModels = this.collectionFilterModels.filter(
      (fm) => fm.filterType === FilterType.COLLECTION
    ) as any[];

    return collectionFilterModels
      .filter((fm) => fm.hasActiveOptions() && fm.activeOptions !== this.mainCollectionId)
      .map((fm) => {
        const filter = _.cloneDeep(fm);
        filter.activeOptions = [filter.activeOptions];
        return filter;
      });
  }

  private createCollectionDTO(filterEqOperation: FilterEqOperation, collectionIds) {
    return {
      field: this.FILTER_FIELD,
      op: filterEqOperation,
      values: collectionIds,
    };
  }
}
