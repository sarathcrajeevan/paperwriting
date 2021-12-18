import {item} from './item';
// todo : when merging experiment rename this to "getData" and use it instead of the old one.
export const query = `query getDataNew($externalId: String!, $compId: String, $mainCollectionId: String, $limit: Int!, $sort: ProductSort, $filters: ProductFilters, $offset: Int, $withOptions: Boolean = false, $withPriceRange: Boolean = false) {
  appSettings(externalId: $externalId) {
    widgetSettings
  }
  catalog {
    category(compId: $compId, categoryId: $mainCollectionId) {
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
