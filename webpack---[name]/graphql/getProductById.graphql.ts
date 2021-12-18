export const query = `query getProductById($externalId: String!, $productId: String!) {
  appSettings(externalId: $externalId) {
    widgetSettings
  }
  catalog {
    product(productId: $productId, onlyVisible: true) {
      id
      name
      price
      customTextFields(limit: 1) {
        title
      }
      isInStock
      urlPart
      hasOptions
      comparePrice
      productType
      isVisible
      discount {
        mode
        value
      }
      sku
      subscriptionPlans {
        list {
           id
           visible
        }
      }
    }
  }
}`;
