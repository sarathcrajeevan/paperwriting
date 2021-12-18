import {PromisifyFunctionReturnType, ResultProp} from './useFunctionResultObservation';
import _ from 'lodash';

let counter = 0;

export const withResultObservation =
  (setProps: (props: {[key: string]: any}) => void) =>
  <T extends {[index: string]: (...args: any) => any}>(
    functions: T
  ): {[K in keyof T]: PromisifyFunctionReturnType<T[K]>} => {
    const listen = <T extends (...args: any) => any>(fn: T, key: string): T => {
      return (async (args: Parameters<T>) => {
        const result = await fn(...args);
        setProps({
          [`${key}Result`]: {counter: counter++, value: result} as ResultProp<ReturnType<T>>,
        });
      }) as unknown as T;
    };

    return _.mapValues(functions, listen) as T;
  };

export type WithResultObservation = ReturnType<typeof withResultObservation>;
