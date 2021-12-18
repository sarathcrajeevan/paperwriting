export const query = `query getCheckoutSettings {
  checkoutSettings {
    taxOnProduct
    termsAndConditions {
      value
      enabled
    }
    checkoutCustomField {
      mandatory
      show
    }
  }
}`;
