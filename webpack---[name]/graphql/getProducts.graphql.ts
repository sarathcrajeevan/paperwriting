export const query = `query getProducts($externalId: String!, $limit: Int, $filters: ProductFilters, $sort: ProductSort) {
  appSettings(externalId: $externalId) {
    widgetSettings
  }
  catalog{
    products(limit: $limit, filters: $filters, sort: $sort, onlyVisible: true) {
      list{
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
  }
}`;
