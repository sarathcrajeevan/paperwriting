import {generateGuid} from '@wix/wixstores-client-core/dist/es/src/guid-generator';
import {IProduct} from '../types/app-types';

const demoAssets = [
  '491a0c_61c2fe24c865488e81fb4480f09ed989~mv2.jpg',
  '491a0c_915a1f5f649d4829a450375c11c55165~mv2.jpg',
  '491a0c_ba6911c295144bef9ad620683351f281~mv2.jpg',
  '491a0c_c998d677f0f64a048e4f5364092bc7d2~mv2.jpg',
  '491a0c_f6ea740311d840bf9a6157f663571066~mv2.jpg',
  '491a0c_f772af17e6e3460697f2db860355a24c~mv2.jpg',
  '491a0c_1309ea1f4b994b4a81db2b8b5ee8152b~mv2.jpg',
  '491a0c_19d439a8ffb54136a08a27bb6ad20d90~mv2.jpg',
  '491a0c_2d54d02a5155414e9b8efb0cd9c22132~mv2.jpg',
  '491a0c_4f27032f6bb94988981f07034445e4c3~mv2.jpg',
  '491a0c_56385870dbfe4595ab6c2286792879c3~mv2.jpg',
  '491a0c_616e3be0d6194612950cd5d5e051b874~mv2.jpg',
];

export const aDemoProduct = (i: number): IProduct => {
  return {
    id: generateGuid(),
    name: 'Demo Product',
    urlPart: `product-url-part-${i}`,
    price: 7.5,
    comparePrice: 0,
    formattedPrice: '$7.50',
    formattedComparePrice: '',
    inventory: {status: 'in_stock', quantity: 0},
    ribbon: '',
    isInStock: true,
    productType: 'physical',
    digitalProductFileItems: [],
    options: [],
    discount: {
      mode: 'PERCENT',
      value: 0,
    },
    media: [
      {
        altText: `Demo product ${i}`,
        height: 1000,
        width: 1000,
        mediaType: 'PHOTO',
        url: demoAssets[i],
        index: i,
        title: '',
      },
    ],
  } as unknown as IProduct;
};
