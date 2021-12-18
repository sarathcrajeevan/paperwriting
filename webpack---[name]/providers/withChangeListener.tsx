let counter = 0;

export interface ResultProp<T> {
  counter: number;
  value: T;
}

export function withChangeListener<T>(value: T): ResultProp<T> {
  return {counter: counter++, value};
}
