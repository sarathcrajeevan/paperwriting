import {OrderFlat, orderMapper} from '@wix/wixstores-platform-common/dist/src';
import {SiteStore} from '@wix/wixstores-client-storefront-sdk/dist/es/src/viewer-script/site-store/SiteStore';
import {thankYouPagePreviewModeDefaultOrder} from './defaultOrder';
import {IFedOpsLogger} from '@wix/wixstores-client-storefront-sdk/dist/es/src/types/native-types';
import {APP_DEFINITION_ID} from '@wix/wixstores-client-core/dist/es/src/constants';
import {FedopsInteractions} from '../constants';

export type WixcodePublicApiConfig = {
  siteStore: SiteStore;
};

export interface IWixcodePublicApi {
  getOrder(): Promise<OrderFlat>;
}

export function wixcodePublicApi({siteStore}: WixcodePublicApiConfig): IWixcodePublicApi {
  const fedopsLoggerFactory = siteStore.platformServices.fedOpsLoggerFactory;
  const fedopsLogger: IFedOpsLogger = fedopsLoggerFactory.getLoggerForWidget({
    appName: APP_DEFINITION_ID,
  });

  const fetchOrder = async (orderId: string, onSuccess: Function) => {
    const query = {
      method: 'get',
      headers: {Authorization: siteStore.instanceManager.getInstance()},
    };

    const response = await fetch(siteStore.resolveAbsoluteUrl(`/_api/orders-server/v2/orders/${orderId}`), query);
    const json = await response.json();

    /* istanbul ignore next */
    if (!json) {
      return;
    }

    if (json.order) {
      const res = orderMapper(json.order);
      onSuccess();
      return res;
    }
  };

  const wixCodeGetOrder = (onSuccess?: Function): Promise<OrderFlat> => {
    if (siteStore.isPreviewMode()) {
      return Promise.resolve(orderMapper(thankYouPagePreviewModeDefaultOrder()));
    } else {
      const {path, query} = siteStore.location;

      try {
        const appSectionParams = JSON.parse(query.appSectionParams);
        if (appSectionParams.objectType === 'subscription') {
          return Promise.reject('subscription order is not supported');
        }
      } catch {
        //
      }

      // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
      if (path && path[1]) {
        const orderId = path[1];
        return fetchOrder(orderId, onSuccess);
      }

      return Promise.reject('missing order id');
    }
  };

  return {
    getOrder: (): Promise<OrderFlat> => {
      fedopsLogger.interactionStarted(FedopsInteractions.GET_ORDER);
      return wixCodeGetOrder(() => {
        fedopsLogger.interactionEnded(FedopsInteractions.GET_ORDER);
      });
    },
  };
}
