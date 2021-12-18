import {BuyerInfoType, Address} from '@wix/wixstores-platform-common/dist/src/orders/order.dto';
import {MediaItemType} from '@wix/wixstores-platform-common/dist/src/defenitions';
import {anOrderResponse} from '@wix/wixstores-platform-common/dist/test/mocks/orders';

export const thankYouPagePreviewModeDefaultOrder = () => {
  const address: Address = {
    addressLine1: 'Address',
    addressLine2: 'addressLine2',
    city: 'city',
    email: 'buyer@wix.com',
    fullName: {
      lastName: 'Name',
      firstName: 'Buyer',
    },
    phone: 'phone',
    street: {
      name: 'name',
      number: 'number',
    },
    subdivision: 'US-NY',
    vatId: {
      number: '123',
      type: '1234',
    },
    zipCode: 'Zip',
    country: 'US',
    company: 'company',
  };

  return anOrderResponse({
    id: '',
    billingInfo: {
      paymentProviderTransactionId: '1',
      paymentGatewayTransactionId: '1',
      externalTransactionId: '1',
      paidDate: new Date('05/25/2000').toISOString(),
      paymentMethod: 'paymentMethod',
      address,
    },
    buyerInfo: {
      id: 'id',
      email: 'buyer@wix.com',
      firstName: 'Buyer',
      identityType: 'identityType',
      lastName: 'Name',
      phone: 'phone',
      type: BuyerInfoType.MEMBER,
    },
    invoiceInfo: {
      source: '111',
      id: '2222',
    },
    buyerNote: 'some text',
    dateCreated: new Date('05/25/2000').toISOString(),
    currency: 'USD',
    fulfillmentStatus: 'fulfillmentStatus',
    archived: false,
    lineItems: [
      {
        customTextFields: [{title: 'title', value: 'value'}],
        productId: '',
        lineItemType: '',
        mediaItem: {
          height: 50,
          mediaType: MediaItemType.image,
          url: 'http://static.wixstatic.com/media/289e7e_4d7e6ed33f324a0aa3e1821ee6142781~mv2.jpeg/v1/fill/w_50,h_50,al_c,q_90/file.jpg',
          width: 50,
          mediaId: '1',
          altText: 'a',
          externalImageUrl:
            'http://static.wixstatic.com/media/289e7e_4d7e6ed33f324a0aa3e1821ee6142781~mv2.jpeg/v1/fill/w_50,h_50,al_c,q_90/file.jpg',
        },
        name: 'A great product',
        notes: 'some notes',
        options: [{option: 'title', selection: 'value'}],
        price: '5',
        quantity: 1,
        sku: 'sku',
        totalPrice: '6',
        weight: '1.42',
        index: 1,
        translatedName: 'a',
        discount: '5',
        tax: '5',
        priceData: {
          price: '5',
          totalPrice: '6',
          taxIncludedInPrice: false,
        },
        taxGroupId: '4',
      },
    ],
    activities: [],
    number: '10000',
    paymentStatus: 'xyz',
    shippingInfo: {
      deliverUntil: '',
      deliveryOption: 'deliveryOption',
      shippingRegion: 'shippingRegion',
      estimatedDeliveryTime: 'estimatedDeliveryTime',
      pickupDetails: {
        buyerDetails: {
          email: '',
          fullName: {
            firstName: '',
            lastName: '',
          },
          phone: '',
        },
        pickupAddress: {
          addressLine1: 'Address',
          city: 'City',
          subdivision: 'subdivision',
          zipCode: 'Zip',
          country: 'country',
        },
        pickupInstructions: 'pickupInstructions',
      },
      shipmentDetails: {
        address,
        trackingInfo: {},
        discount: '5',
        tax: '5',
        priceData: {
          price: '5',
          taxIncludedInPrice: false,
        },
      },
    },
    totals: {
      discount: '0',
      quantity: 1,
      shipping: '0',
      subtotal: '10',
      tax: '0',
      total: '10',
      weight: '1',
    },
    weightUnit: 'kg',
  }).order;
};
