export const query = `query getStoreMetaData {
  storeInfo {
    isPremium
    canStoreShip
    hasCreatedPaymentMethods
  }
  shipping {
    isPickupOnly
  }
  checkoutSettings {
    checkoutGiftCardCheckbox {
      show
    }
  }
}`;
