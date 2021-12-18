import {SiteStore} from '@wix/wixstores-client-storefront-sdk/dist/es/src/viewer-script/site-store/SiteStore';
import {IProductDTO, UserInput, UserInputErrors} from '../types/app-types';
import {
  validateUserInputs,
  formatCustomTextFields,
  actualPrice,
  actualSku,
} from '@wix/wixstores-client-core/dist/es/src/productOptions/productUtils';
import {getProductBySlug, getDefaultProduct} from './getProduct';
import {AddToCartActionOption, BiButtonActionType} from '@wix/wixstores-client-core/dist/es/src/constants';
import {GetProductBySlugQuery, GetFirstProductQuery} from '../graphql/queries-schema';
import {ProductOptionsService} from '@wix/wixstores-client-core/dist/es/src/productOptions/ProductOptionsService';
import {IProductSelectionAvailabilityMap} from '@wix/wixstores-client-core/dist/es/src/productVariantCalculator/ProductVariantCalculator';
import {IProduct} from '@wix/wixstores-graphql-schema';
import {IOptionSelectionVariant} from '@wix/wixstores-client-core/dist/es/src/types/product';
import {getProductVariantBySelectionIds} from '@wix/wixstores-client-core/dist/src/productVariantCalculator/ProductVariantCalculator';
import {BI_APP_NAME} from '../constants';
import {CartActions} from '@wix/wixstores-client-storefront-sdk/dist/es/src/actions/CartActions/CartActions';

export interface ProductVariantInfo {
  variantSelectionIds: number[];
  selectionsAvailability: IProductSelectionAvailabilityMap;
  mediaItems: IProduct['media'];
  priceInfo: Pick<IProduct, 'formattedPrice' | 'price' | 'comparePrice' | 'formattedComparePrice'>;
}

export interface ProductServiceProps {
  handleSelectionsChange: () => void;
  variantInfo: ProductVariantInfo;
}

export class ProductService {
  public options?: ProductOptionsService;
  private product: IProductDTO;
  private readonly withPriceRange: boolean;
  private readonly siteStore: SiteStore;
  private readonly cartActions: CartActions;

  constructor({siteStore, withPriceRange, origin}: {siteStore: SiteStore; withPriceRange: boolean; origin: string}) {
    this.siteStore = siteStore;
    this.withPriceRange = withPriceRange;
    this.cartActions = new CartActions({siteStore: this.siteStore, origin});
  }

  public static mapUserInputsToSelectedOptions(product: IProductDTO, userInputs: UserInput): Record<string, string> {
    return userInputs.selection.reduce((acc, selected) => {
      const optionType = product.options.find((option) => option.selections.find(({id}) => id === selected.id));
      // istanbul ignore else: missing else :(
      if (optionType) {
        acc[optionType.key] = selected.key;
      }
      return acc;
    }, {});
  }

  public static getProductId(product: IProductDTO) {
    return product.id;
  }

  public static getQuantity(userInputs: UserInput): number {
    return userInputs.quantity[0];
  }

  public static mapOptionSelectionIds(userInputs: UserInput): number[] {
    return userInputs.selection.map((selected) => selected.id);
  }

  public static getSubscriptionOptionId(userInputs: UserInput): string | undefined {
    return userInputs.subscriptionPlan[0]?.id;
  }

  public static mapCustomTextFields(
    product: IProductDTO,
    userInputs: UserInput
  ): {title: string; value: string; key?: string; isMandatory?: boolean}[] {
    return formatCustomTextFields(product, userInputs).map((field) => ({
      key: field.customText.key,
      value: field.answer,
      title: field.customText.title,
      isMandatory: field.customText.isMandatory,
    }));
  }

  public static getSelectedVariantId(product: IProductDTO, userInputs: UserInput): string | undefined {
    const optionSelectionIds = userInputs.selection.map((selected) => selected.id);
    const selectedVariant = getProductVariantBySelectionIds({product, variantSelectionIds: optionSelectionIds});

    return selectedVariant?.id;
  }

  public updateOptions(product: IProductDTO): void {
    this.product = product;
    this.options = new ProductOptionsService({product, shouldMutateSelections: false});
  }

  public async getProductBySlug(slug: string, externalId: string): Promise<GetProductBySlugQuery> {
    const {data} = await getProductBySlug(this.siteStore, slug, externalId, this.withPriceRange);
    return data;
  }

  public async getDefaultProduct(externalId: string): Promise<GetFirstProductQuery> {
    const {data} = await getDefaultProduct(this.siteStore, externalId, this.withPriceRange);

    return data;
  }

  public validate(userInputs: UserInput): UserInputErrors {
    return validateUserInputs(this.product, userInputs);
  }

  public shouldNavigateToCart(): boolean {
    return this.cartActions.shouldNavigateToCart();
  }

  public addToCart(
    product: IProductDTO,
    userInputs: UserInput,
    addToCartAction: AddToCartActionOption = AddToCartActionOption.MINI_CART,
    onSuccess: () => void,
    selectedVariant: IOptionSelectionVariant,
    {navigationClick, isNavigateCart}: {navigationClick?: string; isNavigateCart: boolean}
  ): Promise<any> {
    const productId = ProductService.getProductId(product);
    const customTextFieldSelections = ProductService.mapCustomTextFields(product, userInputs);
    const optionsSelectionsIds = ProductService.mapOptionSelectionIds(userInputs);
    const quantity = ProductService.getQuantity(userInputs);
    const variantId = ProductService.getSelectedVariantId(product, userInputs);
    const optionsSelectionsByNames = ProductService.mapUserInputsToSelectedOptions(product, userInputs);
    const subscriptionOptionId = ProductService.getSubscriptionOptionId(userInputs);
    const trackData = {
      id: product.id,
      sku: actualSku(product, selectedVariant),
      type: product.productType,
      name: product.name,
      price: actualPrice(product, selectedVariant),
      buttonType: BiButtonActionType.AddToCart,
      appName: BI_APP_NAME,
      productType: this.product.productType as any,
      isNavigateCart,
      navigationClick,
    };

    return this.cartActions.addToCart(
      {
        productId,
        optionsSelectionsIds,
        optionsSelectionsByNames,
        quantity,
        customTextFieldSelections,
        addToCartAction,
        onSuccess,
        subscriptionOptionId,
        variantId,
      },
      trackData
    );
  }
}
