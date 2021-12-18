import {Http} from '@wix/wixstores-client-core/dist/es/src/http/http';
import {gqlQuery} from './getProduct';
import {SiteStore} from '@wix/wixstores-client-storefront-sdk/dist/es/src/viewer-script/site-store/SiteStore';
import {query as getCartServiceQuery} from '../graphql/getCartService.graphql';
import {graphqlOperation} from '../constants';
import {GetCartServiceQuery, GetStoreMetaDataQuery} from '../graphql/queries-schema';
import {SPECS} from '../specs';
import {CheckoutApiService} from './checkout-api-service';
import {CheckoutType} from './DirectPurchaseService';
import {IProductDTO, StandaloneCheckoutIds, UserInput, VolatileCartFromServer} from '../types/app-types';
import {CheckoutLegacyMutationsCreateCartArgs} from '@wix/wixstores-graphql-schema-node';
import {ProductService} from './ProductService';
import {StoreMetaDataService} from './StoreMetaDataService';

export const VolatileCartApiUrl = '/stores/v1/carts/volatileCart';

export class VolatileCartService {
  private volatileCart: VolatileCartFromServer['cart'] & {checkoutId?: string};
  private readonly checkoutApiService: CheckoutApiService;

  constructor(
    private readonly httpClient: Http,
    private readonly siteStore: SiteStore,
    private readonly storeMetaDataService: StoreMetaDataService
  ) {
    this.checkoutApiService = new CheckoutApiService(siteStore);
  }

  /* istanbul ignore next: experiment always on in test env */
  public shouldUseCheckoutNewApi(experimentName?: string) {
    return experimentName ? this.siteStore.experiments.enabled(experimentName) : true;
  }

  private shouldUseNodeGQL(checkoutType: CheckoutType, storeMetaData: GetStoreMetaDataQuery) {
    if (
      this.siteStore.experiments.enabled(SPECS.BUY_NOW_WITHOUT_GC) &&
      storeMetaData.checkoutSettings.checkoutGiftCardCheckbox.show
    ) {
      return false;
    }

    if (
      checkoutType === CheckoutType.BuyNow &&
      this.shouldUseCheckoutNewApi(SPECS.MIGRATE_VOLATILE_CART_API_TO_GRAPHQL_NODE)
    ) {
      // buynow flow on node
      return true;
    }
    if (
      checkoutType === CheckoutType.Cashier &&
      this.siteStore.experiments.enabled(SPECS.USE_CHECKOUT_ID_IN_FAST_FLOW)
    ) {
      // fast flow and checkout on node
      return true;
    }
    if (
      checkoutType === CheckoutType.Subscribe &&
      this.siteStore.experiments.enabled(SPECS.USE_CHECKOUT_ID_IN_SUBSCRIPTION)
    ) {
      // subscription flow and checkout on node
      return true;
    }
    return false;
  }

  public getStandaloneCheckoutIds = async (
    product: IProductDTO,
    userInputs: UserInput,
    checkoutType: CheckoutType
  ): Promise<StandaloneCheckoutIds> => {
    const storeMetaData = await this.storeMetaDataService.fetchStoreInfo();
    const customTextFieldSelection = ProductService.mapCustomTextFields(product, userInputs);
    const params: CheckoutLegacyMutationsCreateCartArgs = {
      productId: ProductService.getProductId(product),
      optionSelectionId: ProductService.mapOptionSelectionIds(userInputs),
      customTextFieldSelection,
      quantity: ProductService.getQuantity(userInputs),
      subscriptionOptionId: ProductService.getSubscriptionOptionId(userInputs),
      variantId: ProductService.getSelectedVariantId(product, userInputs),
      options: ProductService.mapUserInputsToSelectedOptions(product, userInputs),
      isPickupOnly: storeMetaData.shipping.isPickupOnly,
    };

    if (this.shouldUseNodeGQL(checkoutType, storeMetaData)) {
      const response = await this.checkoutApiService.createCart(params);
      this.volatileCart = response;
    } else {
      this.volatileCart = (await this.httpClient.post(VolatileCartApiUrl, params)).data.cart;
    }

    return {cartId: this.cartId, checkoutId: this.checkoutId};
  };

  public getCart = async (): Promise<GetCartServiceQuery> => {
    return (
      await gqlQuery(
        this.siteStore,
        getCartServiceQuery,
        {cartId: this.cartId, locale: this.siteStore.locale},
        graphqlOperation.GetCartService
      )
    ).data;
  };

  public get cartId() {
    return this.volatileCart.id;
  }

  public get checkoutId() {
    return this.volatileCart.checkoutId;
  }

  public get totals(): VolatileCartFromServer['cart']['totals'] | undefined {
    return this.volatileCart?.totals;
  }
}
