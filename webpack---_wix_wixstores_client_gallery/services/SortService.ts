/* eslint-disable import/no-cycle */
import {ISortingOption} from '../types/galleryTypes';
import _ from 'lodash';
import {sortOptions} from '../constants';
import {ProductSortField, SortDirection} from '@wix/wixstores-graphql-schema';

export class SortService {
  private selectedSort: ISortingOption;

  constructor() {
    this.selectedSort = sortOptions[0];
  }

  public getSelectedSort = (): ISortingOption => {
    return this.selectedSort;
  };

  public setSelectedSort = (sortId: string): ISortingOption => {
    this.selectedSort = _.find(sortOptions, ['id', sortId]);
    return this.selectedSort;
  };

  public getSort = (sortId: string): ISortingOption => {
    if (sortId === 'Default') {
      return _.find(sortOptions, ['id', 'default']);
    } else {
      return _.find(sortOptions, ['id', sortId]);
    }
  };

  public getSortDTO = (sort: ISortingOption | null) => {
    return sort?.field
      ? {
          direction: sort.direction === 'ASC' ? SortDirection.Ascending : SortDirection.Descending,
          sortField: sort.field as ProductSortField,
        }
      : null;
  };
}
