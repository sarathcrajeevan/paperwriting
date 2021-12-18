/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable import/no-cycle */
import _ from 'lodash';
import {
  FilterEqOperation,
  FilterType,
  IFilterDTO,
  IFilterModel,
  IFilterOption,
  IPriceRangeValue,
} from '../types/galleryTypes';

export class PriceFilterModel implements IFilterModel {
  public title: string;
  public options: IFilterOption[];
  public filterId: number;
  public activeOptions: {minPrice: string; maxPrice: string} = {minPrice: '', maxPrice: ''};
  public minPrice: string;
  public maxPrice: string;

  constructor(
    public readonly filterType: FilterType.PRICE,
    title: string,
    options: IFilterOption[],
    private readonly filterField: string = DEFAULT_FILTER_FIELD
  ) {
    this.title = title;
    this.options = options;
    this.setDefaultPrices();
  }

  public updateActiveOptions(priceOption: IPriceRangeValue): void {
    if (this.activeOptions.minPrice !== priceOption.min) {
      this.activeOptions.minPrice = priceOption.min;
    }

    if (this.activeOptions.maxPrice !== priceOption.max) {
      this.activeOptions.maxPrice = priceOption.max;
    }
  }

  public toDTO(): IFilterDTO {
    return {
      field: this.filterField,
      op: this.toOperationDTO(),
      values: _.compact([
        this.hasMinPrice() && this.activeOptions.minPrice,
        this.hasMaxPrice() && this.activeOptions.maxPrice,
      ]),
    };
  }

  public hasActiveOptions(): boolean {
    return this.hasMinPrice() || this.hasMaxPrice();
  }

  public resetActiveOptions(): void {
    this.setDefaultPrices();
  }

  private toOperationDTO(): FilterEqOperation {
    let op: FilterEqOperation;

    if (this.hasMinPrice() && this.hasMaxPrice()) {
      op = FilterEqOperation.BETWEEN;
    } else if (this.hasMinPrice()) {
      op = FilterEqOperation.GTE;
    } else {
      op = FilterEqOperation.LTE;
    }

    return op;
  }

  private hasMinPrice() {
    return this.activeOptions.minPrice && this.activeOptions.minPrice !== this.minPrice;
  }

  private hasMaxPrice() {
    return this.activeOptions.maxPrice && this.activeOptions.maxPrice !== this.maxPrice;
  }

  private setDefaultPrices() {
    this.activeOptions.minPrice = this.minPrice = this.options[0].key;
    this.activeOptions.maxPrice = this.maxPrice = this.options[this.options.length - 1].key;
  }
}

const DEFAULT_FILTER_FIELD = 'comparePrice';
