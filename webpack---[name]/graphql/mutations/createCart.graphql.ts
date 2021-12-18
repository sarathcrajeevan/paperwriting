export const query = `mutation createCart(
  $productId: String!
  $optionSelectionId: [Int]!
  $quantity: Int!
  $customTextFieldSelection: [CustomTextOptionInput]!
  $subscriptionOptionId: String
  $buyerNote: String
  $variantId: String
  $isPickupOnly: Boolean
  $options: Json
) {
  checkout {
    createCart(
      productId: $productId
      optionSelectionId: $optionSelectionId
      customTextFieldSelection: $customTextFieldSelection
      quantity: $quantity
      subscriptionOptionId: $subscriptionOptionId
      buyerNote: $buyerNote
      variantId: $variantId
      isPickupOnly: $isPickupOnly
      options: $options
    ) {
      checkoutId
      appliedCoupon {
        code
        convertedDiscountValue
        couponId
        couponType
        discountValue
        name
      }
      billingAddress {
        address {
          addressLine
          addressLine2
          city
          country
          countryFullname
          formattedAddress
          geocode {
            latitude
            longitude
          }
          hint
          postalCode
          streetAddress {
            apt
            name
            number
          }
          subdivision
          subdivisionFullname
          subdivisions {
            code
            name
            type
            typeInfo
          }
        }
        contactDetails {
          company
          email
          firstName
          fullName
          lastName
          phone
          vatId {
            id
            type
          }
        }
      }
      buyerInfo {
        email
        firstName
        id
        lastName
        phone
      }
      buyerNote
      convertedCurrency {
        code
        symbol
      }
      convertedTotals {
        discount
        quantity
        shipping
        subtotal
        tax
        total
        weight
      }
      currency {
        code
        symbol
      }
      id
      lineItems {
        convertedPriceData {
          price
          totalPrice
        }
        customTextFields {
          title
          key
          value
        }
        id
        lineItemType
        mediaItem {
          height
          mediaType
          url
          width
        }
        name
        notes
        options {
          option
          selection
        }
        price
        priceData {
          price
          totalPrice
        }
        productId
        quantity
        sku
        totalPrice
        weight
      }
      shippingInfo {
        pickupDetails {
          buyerDetails {
            email
            firstName
            lastName
            phone
          }
          pickupAddress {
            addressLine
            addressLine2
            city
            country
            countryFullname
            formattedAddress
            geocode {
              latitude
              longitude
            }
            hint
            postalCode
            streetAddress {
              apt
              name
              number
            }
            subdivision
            subdivisions {
              code
              name
              type
              typeInfo
            }
          }
          pickupInstructions
        }
        shippingAddress {
          address {
            addressLine
            addressLine2
            city
            country
            countryFullname
            formattedAddress
            geocode {
              latitude
              longitude
            }
            hint
            postalCode
            streetAddress {
              apt
              name
              number
            }
            subdivision
            subdivisionFullname
            subdivisions {
              code
              name
              type
              typeInfo
            }
          }
          contactDetails {
            company
            email
            firstName
            fullName
            lastName
            phone
            vatId {
              id
              type
            }
          }
        }
        shippingRuleDetails {
          deliveryOption
          estimatedDeliveryTime
          optionId
          ruleId
        }
      }
      status
      totals {
        discount
        quantity
        shipping
        subtotal
        tax
        total
        weight
      }
      weightUnit
    }
  }
}
`;
