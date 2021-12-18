/* eslint-disable import/no-cycle */
import {FilterType, IFilterModel, IFilterOption} from '../types/galleryTypes';

export class CollectionFilterModel implements IFilterModel {
  public title: string;
  public options: IFilterOption[];
  public activeOptions: string;
  public filterId: number;

  constructor(
    public readonly filterType: FilterType.COLLECTION,
    title: string,
    options: IFilterOption[],
    private readonly mainCollectionId: string
  ) {
    this.title = title;
    this.options = options;
    this.activeOptions = mainCollectionId;
  }

  public updateActiveOptions(optionId: string): void {
    this.activeOptions = optionId;
  }

  public hasActiveOptions(): boolean {
    return this.activeOptions !== '';
  }

  public resetActiveOptions(): void {
    this.updateActiveOptions(this.mainCollectionId);
  }

  public isDefaultOptionSelected(): boolean {
    return this.activeOptions === this.mainCollectionId;
  }
}
