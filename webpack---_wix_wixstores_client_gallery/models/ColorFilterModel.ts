/* eslint-disable prefer-named-capture-group */
/* eslint-disable @typescript-eslint/prefer-string-starts-ends-with */
/* eslint-disable import/no-cycle */
import {FilterEqOperation, FilterType, IFilterDTO, IFilterModel, IFilterOption} from '../types/galleryTypes';
import _ from 'lodash';

export class ColorFilterModel implements IFilterModel {
  public title: string;
  public options: IFilterOption[];
  public filterId: number;
  public activeOptions: string[] = [];

  private readonly FILTER_FIELD = 'optionChoices';

  constructor(
    public readonly filterType: FilterType.COLOR_OPTION,
    title: string,
    options: IFilterOption[],
    private readonly field: string
  ) {
    this.title = title;
    this.options = this.toColorOptions(options);
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

    const hexColors = [];
    this.activeOptions.forEach((selectedOptionId) => {
      const hexColor = this.convertRgbToHex(selectedOptionId);

      if (hexColor !== selectedOptionId) {
        hexColors.push(hexColor);
      }
      const shortHex = this.hexToShortHex(hexColor);

      if (shortHex !== hexColor) {
        hexColors.push(shortHex);
      }
    });

    let values = [...this.activeOptions, ...hexColors];
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

  private toColorOptions(filterOptions: IFilterOption[]): IFilterOption[] {
    return _.uniqBy(
      filterOptions.map((filterOption) => {
        return {
          key: this.convertToRgb(filterOption.key),
          value: filterOption.value,
        };
      }),
      'key'
    );
  }

  private convertRgbToHex(rgbValue: string): string {
    const digits = /(.*?)rgb\((\d+), (\d+), (\d+)\)/.exec(rgbValue);

    if (digits) {
      const red = parseInt(digits[2], 10);
      const green = parseInt(digits[3], 10);
      const blue = parseInt(digits[4], 10);

      return `#${this.componentToHex(red)}${this.componentToHex(green)}${this.componentToHex(blue)}`.toLowerCase();
    } else {
      return rgbValue;
    }
  }

  private convertToRgb(colorValue: string): string {
    let result = colorValue;
    let colorRegexRes: RegExpExecArray;

    if (colorValue.length === 7) {
      colorRegexRes = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(colorValue);

      result = colorRegexRes
        ? `rgb(${parseInt(colorRegexRes[1], 16)}, ${parseInt(colorRegexRes[2], 16)}, ${parseInt(colorRegexRes[3], 16)})`
        : colorValue;
    } else if (colorValue.length === 4) {
      colorRegexRes = /^#?([a-f\d]{1})([a-f\d]{1})([a-f\d]{1})$/i.exec(colorValue);

      result = colorRegexRes
        ? `rgb(${parseInt(colorRegexRes[1] + colorRegexRes[1], 16)}, ${parseInt(
            colorRegexRes[2] + colorRegexRes[2],
            16
          )}, ${parseInt(colorRegexRes[3] + colorRegexRes[3], 16)})`
        : colorValue;
    }
    return result;
  }

  private componentToHex(c: number): string {
    const hex = c.toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
  }

  private hexToShortHex(hexValue: string): string {
    let shortHex = hexValue;
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexValue);
    if (result && result[1][0] === result[1][1] && result[2][0] === result[2][1] && result[3][0] === result[3][1]) {
      shortHex = `#${result[1][0]}${result[2][0]}${result[3][0]}`;
    }
    return shortHex;
  }
}
