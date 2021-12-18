export const query = `query getDataNode($externalId: String!) {
  appSettings(externalId: $externalId) {
    widgetSettings
  }
    cart {
      cartId
      items {
        cartItemId
        freeText {
          title
          value
        }
        product {
          id
          productType
          urlPart
          name
          media(limit: 1) {
            altText
            mediaType
            url
            height
            width
          }
          digitalProductFileItems {
            fileType
          }
        }
        optionsSelectionsValues {
          id
          title
          value
        }
        quantity
        inventoryQuantity
        convertedPrices {
          formattedComparePrice
          formattedPrice
        }
      }
      convertedTotals  {
        itemsTotal
        formattedItemsTotal
      }
    }
}`;
