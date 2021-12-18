export const query = `query getWishlist($limit: Int!, $offset: Int!) {
  wishlist(limit: $limit, offset: $offset) {
    totalCount
    items {
      product {
        id
        options(limit: 1) {
          id
        }
        customTextFields(limit: 1) {
          title
        }
        productType
        ribbon
        price
        comparePrice
        discount {
          mode
          value
        }
        isInStock
        urlPart
        formattedComparePrice
        formattedPrice
        sku
        digitalProductFileItems {
          fileType
        }
        name
        media {
          url
          index
          width
          mediaType
          altText
          title
          height
        }
        isManageProductItems
        isTrackingInventory
        inventory {
          status
          quantity
        }
      }
    }
  }
}
`;
