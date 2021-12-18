export default class UrlQueryParamsBuilder {
  private readonly queryParams = [];

  constructor(private readonly startParams = '') {}

  add(key, value) {
    if (value) {
      if (Array.isArray(value)) {
        value.forEach((internalValue) => this.add(key, internalValue));
      } else {
        this.queryParams.push({ key, value });
      }
    }
    return this;
  }

  build() {
    if (this.queryParams.length) {
      const jointParams = this.queryParams
        .map(({ key, value }) => `${key}=${value}`)
        .join('&');

      return `${this.startParams ? `${this.startParams}&` : '?'}${jointParams}`;
    }

    return this.startParams;
  }
}
