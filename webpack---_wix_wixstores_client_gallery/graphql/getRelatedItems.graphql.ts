import {item} from './item';

export const query = `query getRelatedItems($externalId: String!, $productIds: [String!]!, $withOptions: Boolean = false, $withPriceRange: Boolean = false) {
    appSettings(externalId: $externalId) {
      widgetSettings
    }
    catalog {
      relatedProducts(productIds: $productIds) {
         ${item}
      }
    }
  }
  `;
