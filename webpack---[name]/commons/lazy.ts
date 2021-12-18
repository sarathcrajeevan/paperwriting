export interface LazyValue<T> {
  value: T;
}

export const createLazyValue = <T>(create: () => T): LazyValue<T> => {
  let created = false;
  let instance;

  return {
    get value(): T {
      if (!created) {
        instance = create();
        created = true;
      }
      return instance;
    },
  };
};
