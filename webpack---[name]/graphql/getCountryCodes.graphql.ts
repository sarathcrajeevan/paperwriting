export const query = `query getCountryCodes {
  localeData(language: "en") {
    countries {
      key
      shortKey
    }
  }
}`;
