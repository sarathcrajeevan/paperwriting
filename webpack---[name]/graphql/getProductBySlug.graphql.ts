export const query = `query getProductBySlug($externalId: String!, $slug: String!, $withPriceRange: Boolean = false) {
  appSettings(externalId: $externalId) {
    widgetSettings
  }
  catalog {
    product(slug: $slug, onlyVisible: true) {
      id
      description
      isVisible
      sku
      ribbon
      brand
      price
      comparePrice
      discountedPrice
      formattedPrice
      formattedComparePrice
      formattedDiscountedPrice
      pricePerUnit
      formattedPricePerUnit
      pricePerUnitData {
        baseQuantity
        baseMeasurementUnit
      }
      seoTitle
      seoDescription
      createVersion
      digitalProductFileItems {
        fileId
        fileType
        fileName
      }
      productItems(withDefaultVariant: true) {
        id
        price
        comparePrice
        formattedPrice
        formattedComparePrice
        pricePerUnit
        formattedPricePerUnit
        optionsSelections
        isVisible
        inventory {
          status
          quantity
        }
        sku
        weight
        surcharge
        subscriptionPlans {
          list {
            id
            price
            formattedPrice
            pricePerUnit
            formattedPricePerUnit
          }
        }
      }
      name
      isTrackingInventory
      inventory {
        status
        quantity
      }
      isVisible
      isManageProductItems
      isInStock
      media {
        id
        url
        fullUrl
        altText
        thumbnailFullUrl: fullUrl(width: 50, height: 50)
        mediaType
        videoType
        videoFiles {
          url
          width
          height
          format
          quality
        }
        width
        height
        index
        title
      }
      customTextFields {
        key
        title
        isMandatory
        inputLimit
      }
      nextOptionsSelectionId
      options {
        id
        title
        optionType
        key
        selections {
          id
          value
          description
          key
          linkedMediaItems {
            altText
            url
            fullUrl
            thumbnailFullUrl: fullUrl(width: 50, height: 50)
            mediaType
            width
            height
            index
            title
            videoFiles {
              url
              width
              height
              format
              quality
            }
          }
        }
      }
      productType
      urlPart
      additionalInfo {
        id
        title
        description
        index
      }
      subscriptionPlans {
        list(onlyVisible: true) {
          id
          name
          tagline
          frequency
          duration
          price
          formattedPrice
          pricePerUnit
          formattedPricePerUnit
        }
        oneTimePurchase {
          index
        }
      }
      priceRange(withSubscriptionPriceRange: true) @include(if: $withPriceRange) {
        fromPriceFormatted
      }
      discount {
        mode
        value
      }
      currency
      weight
      seoJson
    }
  }
}`;
