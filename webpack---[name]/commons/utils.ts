import {DimensionsConfigUnit} from '../types/app-types';

export function convertCssValueToConfig(cssValue: string): DimensionsConfigUnit {
  if (/^(\d+px)$/.test(cssValue)) {
    const n = /\d+/.exec(cssValue)[0];
    return {num: parseInt(n, 10), unit: 'px'};
  } else if (/^(\d+\.\d+px)$/.test(cssValue)) {
    const n = /\d+\.\d+/.exec(cssValue)[0];
    return {num: parseFloat(n), unit: 'px'};
  }
  return null;
}

export function compose(...fns) {
  return <T>(input: T): T => fns.reduce((acc, fn) => fn(acc), input);
}

export function all(...promises: Promise<any>[]): Promise<any[]> {
  return Promise.all(promises);
}

export function emptyArrayOf(n: number, initialValue?: any) {
  return Array(n).fill(initialValue);
}

export function stripHtmlTags(input: string) {
  return input.replace(/<(?:.|\n)*?>/gm, '');
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/* istanbul ignore next: todo(sagi): test */
export function capitalizeFirstLetters(string: string = '') {
  return string
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLocaleLowerCase())
    .join(' ');
}
