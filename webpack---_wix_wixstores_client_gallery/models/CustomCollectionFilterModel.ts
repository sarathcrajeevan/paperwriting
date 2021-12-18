/* eslint-disable import/no-cycle */
import {IFilterModel, IFilterOption, FilterType} from '../types/galleryTypes';

export class CustomCollectionFilterModel implements IFilterModel {
  public title: string;
  public options: IFilterOption[];
  public activeOptions: string[] = [];
  public selectedOptions: string[] = [];
  public filterId: number;

  constructor(public readonly filterType: FilterType.CUSTOM_COLLECTION, title: string, options: IFilterOption[]) {
    this.title = title;
    this.options = options;
  }

  public updateActiveOptions(optionId: string): void {
    if (!this.activeOptions.includes(optionId)) {
      this.activeOptions.push(optionId);
    } else {
      const index = this.activeOptions.indexOf(optionId);
      this.activeOptions.splice(index, 1);
    }
  }

  public hasActiveOptions(): boolean {
    return !!this.activeOptions.length;
  }

  public resetActiveOptions(): void {
    this.activeOptions = [];
    this.selectedOptions = [];
  }
}
