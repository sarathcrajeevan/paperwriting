import {item} from './item';

export const query = `query getData($externalId: String!, $compId: String!, $limit: Int!, $sort: ProductSort, $filters: ProductFilters, $offset: Int, $withOptions: Boolean = false, $withPriceRange: Boolean = false) {
  appSettings(externalId: $externalId) {
    widgetSettings
  }
  catalog {
    category(compId: $compId) {
      id
      name
      productsWithMetaData(limit: $limit, onlyVisible: true, sort: $sort, filters: $filters, offset: $offset) {
        list {
          ${item}
        }
        totalCount
      }
    }
  }
}
`;
