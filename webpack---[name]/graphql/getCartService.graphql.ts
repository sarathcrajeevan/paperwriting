export const query = `query getCartService($cartId: String!, $locale: String!) {
  cartService {
    cart(cartId: $cartId) {
      totals(withTax: true, withShipping: true) {
        subTotal
        total
        shipping
        discount
        itemsTotal
        tax
        formattedItemsTotal
        formattedSubTotal
        formattedShipping
        formattedDiscount
        formattedTax
        formattedTotal
      }
      shippingRuleInfo {
        status
        canShipToDestination
        shippingRule {
          id
          options {
            id
            title
            rate: convertedRate
            formattedRate: convertedFormattedRate
            deliveryTime
            pickupInfo {
              address {
                countryName(translateTo: $locale)
                subdivisionName(translateTo: $locale)
                addressLine
                city
                zipCode
              }
            }
          }
        }
      }
      destinationCompleteness
    }
  }
}`;
