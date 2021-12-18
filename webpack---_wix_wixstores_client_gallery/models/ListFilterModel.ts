/* eslint-disable import/no-cycle */
import {FilterEqOperation, FilterType, IFilterDTO, IFilterModel, IFilterOption} from '../types/galleryTypes';

export class ListFilterModel implements IFilterModel {
  public title: string;
  public options: IFilterOption[];
  public filterId: number;
  public activeOptions: string[] = [];
  public selectedOptions: string[] = [];

  private readonly FILTER_FIELD = 'optionChoices';

  constructor(
    public readonly filterType: FilterType.LIST_OPTION,
    title: string,
    options: IFilterOption[],
    private readonly field: string
  ) {
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

  public toDTO(): IFilterDTO {
    const shouldReplaceOption = this.field.startsWith('options.');
    const optionName = shouldReplaceOption ? this.field.replace('options.', '') : this.field;

    let values = this.activeOptions;
    if (shouldReplaceOption) {
      values = values.map((option) => `${optionName}#${option}`);
    }
    return {
      field: shouldReplaceOption ? this.FILTER_FIELD : this.field,
      op: FilterEqOperation.IN,
      values,
    };
  }

  public hasActiveOptions(): boolean {
    return !!this.activeOptions.length;
  }

  public resetActiveOptions(): void {
    this.activeOptions = [];
  }
}
