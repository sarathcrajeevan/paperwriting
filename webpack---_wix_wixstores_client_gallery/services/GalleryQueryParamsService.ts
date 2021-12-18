/* eslint-disable import/no-cycle */
import {FilterModel, FilterType, IFilterModel, IQueryParamsFilter, ISorting} from '../types/galleryTypes';
import {PriceFilterModel} from '../models/PriceFilterModel';
import {SiteStore} from '@wix/wixstores-client-storefront-sdk/dist/es/src/viewer-script/site-store/SiteStore';

export enum DefaultQueryParamKeys {
  Sort = 'sort',
  Page = 'page',
}

export class GalleryQueryParamsService {
  private readonly currentUrlSearchParams: {paramTitle: string; paramValue: string}[];

  constructor(private readonly siteStore: SiteStore) {
    this.currentUrlSearchParams = [];
  }

  public readonly getQueryParam = (paramTitle: string): string => {
    const queryParams = this.siteStore.location.query;
    this.setAndUpdateCurrentQueryParams(paramTitle, queryParams[paramTitle]);
    return queryParams[paramTitle];
  };

  protected readonly setAndUpdateCurrentQueryParams = (paramTitle: string, paramValue: string) => {
    let index = -1;
    this.currentUrlSearchParams.forEach((param, i) => {
      /* istanbul ignore next: todo: test */
      if (param.paramTitle === paramTitle) {
        index = i;
      }
    });

    if (index === -1) {
      this.currentUrlSearchParams.push({paramTitle, paramValue});
    } else {
      this.currentUrlSearchParams[index] = {paramTitle, paramValue};
    }
  };

  public readonly getFiltersQueryParams = (filterModels: FilterModel[]): IQueryParamsFilter[] => {
    const decodedSearchParams = this.getDecodedSearchParams(this.siteStore.location.query);
    const activeFilters = [];

    const delimiter = ',';

    filterModels.forEach((filter) => {
      if (decodedSearchParams[filter.title]) {
        const paramsFilter = decodedSearchParams[filter.title];
        switch (filter.filterType) {
          case FilterType.LIST_OPTION:
          case FilterType.CUSTOM_COLLECTION:
          case FilterType.COLOR_OPTION:
          case FilterType.COLLECTION: {
            activeFilters.push({
              key: filter.title,
              value: paramsFilter,
              filterId: filter.filterId,
            });

            break;
          }
          case FilterType.PRICE: {
            const priceValue = paramsFilter.split('-');
            activeFilters.push({
              key: filter.title,
              value: `${priceValue[0]}${delimiter}${priceValue[1]}`,
              filterId: filter.filterId,
            });
          }
        }
        this.setAndUpdateCurrentQueryParams(filter.title, paramsFilter);
      }
    });

    return activeFilters.length > 0 ? activeFilters : null;
  };

  public readonly updatePageQueryParam = (page?: number): void => {
    if (page) {
      this.setAndUpdateQueryParams(DefaultQueryParamKeys.Page, page.toString());
    } else {
      this.removeQueryParam(DefaultQueryParamKeys.Page);
    }
  };

  public readonly updateSortQueryParams = (selectedSort: ISorting) => {
    if (selectedSort.id === 'default') {
      this.removeQueryParam(DefaultQueryParamKeys.Sort);
    } else {
      this.setAndUpdateQueryParams(DefaultQueryParamKeys.Sort, selectedSort.id);
    }
  };

  public readonly clearAllFiltersQueryParams = (paramTitles: string[]) => {
    this.siteStore.location.queryParams.remove(paramTitles);
    paramTitles.forEach((title) => {
      const index = this.currentUrlSearchParams.findIndex((param) => param.paramTitle === title);
      if (index !== -1) {
        this.currentUrlSearchParams.splice(index, 1);
      }
    });
  };

  public readonly updateFiltersQueryParams = (
    filterId: number,
    filterModels: FilterModel[],
    mainCollectionId: string
  ) => {
    const {title, value} = this.getActiveFilterOptionByFilters(filterId, filterModels, mainCollectionId);

    if (value) {
      this.setAndUpdateQueryParams(title, value);
    }
  };

  public readonly updateFiltersQueryParamsState = (
    filterId: number,
    filterModels: FilterModel[],
    mainCollectionId: string
  ) => {
    const {title, value} = this.getActiveFilterOptionByFilters(filterId, filterModels, mainCollectionId);

    if (value) {
      this.setAndUpdateCurrentQueryParams(title, value);
      this.setAndUpdateQueryParamsState(title, value);
    }
  };

  public getActiveFilterOptionByFilters(
    filterId: number,
    filterModels: FilterModel[],
    mainCollectionId: string
  ): {title: string; value: string} {
    const filterModel = filterModels.find((fm) => fm.filterId === filterId) as IFilterModel;
    let activeFilterOption: string = '';

    const delimiter = ',';

    switch (filterModels[filterId].filterType) {
      case FilterType.COLLECTION: {
        if (filterModel.activeOptions === mainCollectionId) {
          activeFilterOption = `All`;
        } else {
          const filterOption = filterModel.options.find((option) => option.key === filterModel.activeOptions);
          activeFilterOption = filterOption.value;
        }
        break;
      }
      case FilterType.LIST_OPTION:
      case FilterType.CUSTOM_COLLECTION:
      case FilterType.COLOR_OPTION: {
        const filterOptions = filterModel.options.filter(
          (option) => filterModel.activeOptions.indexOf(option.key) > -1
        );

        if (filterOptions.length === 1) {
          activeFilterOption = filterOptions[0].value;
        } else if (filterOptions.length === 0) {
          this.removeQueryParam(filterModel.title);
        } else {
          activeFilterOption = filterOptions.map((filter) => filter.value).join(delimiter);
        }

        break;
      }
      case FilterType.PRICE: {
        activeFilterOption = `${(filterModel.activeOptions as PriceFilterModel).minPrice}-${
          (filterModel.activeOptions as PriceFilterModel).maxPrice
        }`;
      }
    }

    return {title: filterModel.title, value: activeFilterOption};
  }

  public applyQueryParamsStateOnUrl = () => {
    this.currentUrlSearchParams.forEach((activeFilter) => {
      this.setAndUpdateUrlQueryParams(activeFilter.paramTitle, activeFilter.paramValue);
    });
  };

  private readonly getDecodedSearchParams = (searchParams: {
    [paramKey: string]: string;
  }): {[paramKey: string]: string} => {
    return Object.keys(searchParams).reduce((res, key) => {
      const decodedKey = this.safeDecode(key);
      const decodedValue = this.safeDecode(searchParams[key]);
      const isParamValid = decodedKey && decodedValue;

      return isParamValid
        ? {
            ...res,
            [decodedKey]: decodedValue,
          }
        : res;
    }, {});
  };

  private readonly removeQueryParam = (paramTitle) => {
    const index = this.currentUrlSearchParams.findIndex((param) => param.paramTitle === paramTitle);

    this.currentUrlSearchParams.splice(index, 1);
    this.siteStore.location.queryParams.remove([paramTitle]);
  };

  private readonly setAndUpdateQueryParamsState = (paramTitle: string, paramValue: string) => {
    this.setAndUpdateCurrentQueryParams(paramTitle, paramValue);
  };

  private readonly setAndUpdateUrlQueryParams = (paramTitle: string, paramValue: string) => {
    this.siteStore.location.queryParams.add({[paramTitle]: paramValue});
  };

  private readonly setAndUpdateQueryParams = (paramTitle: string, paramValue: string) => {
    this.setAndUpdateQueryParamsState(paramTitle, paramValue);
    this.setAndUpdateUrlQueryParams(paramTitle, paramValue);
  };

  private readonly safeDecode = (str: string) => {
    let decoded;
    try {
      decoded = decodeURIComponent(str).replace(/\+/g, ' ');
    } catch (e) {
      //All of our filter query params can be decoded, this only happens when users add custom query params and there's no need to alert it.
    }
    return decoded;
  };
}
