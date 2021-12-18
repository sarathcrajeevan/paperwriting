import {SiteStore} from '@wix/wixstores-client-storefront-sdk/dist/es/src/viewer-script/site-store/SiteStore';
import {GUID} from '@wix/bi-logger-ec-sf';

export const updateWixCounters = (siteStore: SiteStore, productId: string, uuid: GUID) => {
  const query = {
    method: 'post',
    headers: {'Content-Type': 'application/json', Accept: '*/*'},
    body: JSON.stringify({
      messageId: uuid,
      metrics: [
        {
          type: 'product',
          reportMetrics: [{name: 'view', value: 1}],
          properties: {store_id: siteStore.storeId, product_id: productId},
        },
      ],
    }),
  };
  return fetch('https://stores-counters.wix.com/collector/rest/collect-js', query);
};
