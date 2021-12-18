import {actualPrice, hasDiscount} from '@wix/wixstores-client-core/dist/es/src/productOptions/productUtils';
import {IOptionSelectionVariant} from '@wix/wixstores-client-core/dist/es/src/types/product';

import {IProduct} from '@wix/wixstores-graphql-schema/dist/es/src';
import {ISubscriptionPlan} from '../components/ProductOptions/SubscriptionPlans/SubscriptionPlan/SubscriptionPlan';
import {CurrentPrice, UserInput} from '../types/app-types';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class ProductPriceService {
  private readonly product: IProduct;
  private readonly selectedVariant: IOptionSelectionVariant;
  private readonly selectedPlan: ISubscriptionPlan;
  private readonly useDiscountedPrice: boolean;
  private readonly shouldRenderPriceRange: boolean;

  constructor({product, selectedVariant, selectedPlan, shouldRenderPriceRange}) {
    this.product = product;
    this.selectedVariant = selectedVariant;
    this.selectedPlan = selectedPlan;
    this.shouldRenderPriceRange = shouldRenderPriceRange;
  }

  private get ref() {
    return this.selectedVariant || this.product;
  }

  private get hasPricePerUnit() {
    return !!this.product.pricePerUnitData;
  }

  private get hasSelectedPlan() {
    return !!this.selectedPlan;
  }

  private get pricesPerUnit() {
    if (!this.hasPricePerUnit) {
      return null;
    }

    const ref: Partial<{
      formattedPricePerUnit: IProduct['formattedPricePerUnit'];
      pricePerUnit: IProduct['pricePerUnit'];
    }> =
      this.selectedVariant?.subscriptionPlans?.[this.selectedPlan?.id] ||
      this.selectedVariant ||
      this.product.subscriptionPlans?.list.find((plan) => plan.id === this.selectedPlan?.id) ||
      this.product;

    return {
      baseMeasurementUnit: this.product.pricePerUnitData.baseMeasurementUnit,
      baseQuantity: this.product.pricePerUnitData.baseQuantity,
      formattedPricePerUnit: ref.formattedPricePerUnit,
      pricePerUnit: ref.pricePerUnit,
    };
  }

  private get hasDiscount() {
    return hasDiscount(this.product);
  }

  private get productPricing(): CurrentPrice {
    const currentActualPrice = actualPrice(this.product, this.selectedVariant);
    // const discountedKey = this.useDiscountedPrice ? 'formattedDiscountedPrice' : 'formattedComparePrice';
    // todo: switch keys when the FT is mereged (@sagii)
    void this.useDiscountedPrice;
    const discountedKey = 'formattedComparePrice';

    return {
      isZeroPrice: currentActualPrice === 0,
      formattedActualPrice: this.hasDiscount ? this.ref[discountedKey] : this.ref.formattedPrice,
      formattedPassivePrice: this.hasDiscount ? this.ref.formattedPrice : null,
    };
  }

  private get subscriptionPricing(): CurrentPrice {
    const ref: Partial<{
      formattedPrice: IProduct['formattedPrice'];
      formattedComparePrice: IProduct['formattedComparePrice'];
      frequency: CurrentPrice['frequency'];
    }> =
      this.selectedVariant?.subscriptionPlans?.[this.selectedPlan.id] ||
      this.selectedVariant ||
      this.product.subscriptionPlans.list.find((plan) => plan.id === this.selectedPlan.id);

    return {
      formattedActualPrice: ref.formattedComparePrice || ref.formattedPrice,
      frequency: this.selectedPlan.frequency,
    };
  }

  private getPriceRange(): Partial<Pick<CurrentPrice, 'formattedFromPrice'>> {
    if (this.product.priceRange) {
      return {
        formattedFromPrice: this.product.priceRange.fromPriceFormatted,
      };
    }
    return {};
  }

  private shouldRenderPriceRangeFinal({selection, subscriptionPlan}: UserInput): boolean {
    const isAnyOptionSelected = selection.some((s) => !!s);
    return this.shouldRenderPriceRange && !isAnyOptionSelected && subscriptionPlan.length === 0;
  }

  public getCurrentPricing(userInputs: UserInput): CurrentPrice {
    const hasRecurringPlan = this.hasSelectedPlan && !this.selectedPlan.isOneTimePurchase;
    const pricing = hasRecurringPlan ? this.subscriptionPricing : this.productPricing;
    const priceRange = this.shouldRenderPriceRangeFinal(userInputs) ? this.getPriceRange() : {};

    return {
      ...this.pricesPerUnit,
      ...pricing,
      ...priceRange,
    };
  }
}
