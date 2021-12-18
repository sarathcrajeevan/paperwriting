/* eslint-disable import/no-cycle */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable no-nested-ternary */
import {
  IAddProductImpression,
  ICollectionIdsFilterDTO,
  IGetCategoryProducts,
  IGetInitialData,
  IOldGetInitialData,
  IProduct,
  IProductOption,
  ISorting,
  ReducedOptionSelection,
} from '../types/galleryTypes';
import {SiteStore} from '@wix/wixstores-client-storefront-sdk/dist/es/src/viewer-script/site-store/SiteStore';
import {DataApi, GetProductsRequest, GetProductsResponse} from '../api/DataApi';
import {GetDataQuery, ProductFilters} from '../graphql/queries-schema';
import {
  FedopsInteraction,
  origin,
  TRACK_EVENT_COLLECTION,
  trackEventMetaData,
  TrackEvents,
  BATCH_MAX_SIZE,
  MAX_PRODUCTS_BATCHING,
} from '../constants';
import {
  AddToCartActionOption,
  APP_DEFINITION_ID,
  BiButtonActionType,
  STORAGE_PAGINATION_KEY,
} from '@wix/wixstores-client-core/dist/es/src/constants';
import {IStoreFrontNavigationContext} from '@wix/wixstores-client-core/dist/es/src/types/site-map';
import {
  actualPrice,
  actualSku,
  hasSubscriptionPlans,
} from '@wix/wixstores-client-core/dist/es/src/productOptions/productUtils';
import {ProductsOptionsService, ProductsVariantInfoMap} from './ProductsOptionsService';
import {QuickViewActions} from '@wix/wixstores-client-storefront-sdk/dist/es/src/actions/QuickViewActions/QuickViewActions';
import {IOptionSelectionVariant} from '@wix/wixstores-client-core/dist/es/src/types/product';
import {getProductVariantBySelectionIds} from '@wix/wixstores-client-core/dist/es/src/productVariantCalculator/ProductVariantCalculator';
import {ProductsPriceRangeService, ProductsPriceRangeServiceMap} from './ProductsPriceRangeService';
import _ from 'lodash';
import {CartActions} from '@wix/wixstores-client-storefront-sdk/dist/es/src/actions/CartActions/CartActions';

export class ProductsService {
  private readonly dataApi: DataApi;
  public products: IProduct[];
  private readonly productsOptionsService = new ProductsOptionsService();
  private readonly priceRangeService = new ProductsPriceRangeService();
  public totalCount: number;
  public collectionName: string;
  private filters: ProductFilters = null;
  private collectionIds: ICollectionIdsFilterDTO;
  private sorting?: ISorting;
  public hideGallery = false;
  private readonly quickViewActions: QuickViewActions;
  private readonly cartActions: CartActions;

  constructor(
    private readonly siteStore: SiteStore,
    private productsPerPage: number,
    private readonly consumerName: string,
    private withOptions: boolean,
    private readonly withPriceRange: boolean,
    private readonly fedopsLogger,
    private readonly shouldUseWarmupData: boolean
  ) {
    this.dataApi = new DataApi(this.siteStore);
    this.quickViewActions = new QuickViewActions(this.siteStore);
    this.cartActions = new CartActions({siteStore: this.siteStore, origin});
  }

  public updateFiltersAndSort = (filters: ProductFilters, sorting?: ISorting) => {
    this.filters = filters;
    this.sorting = sorting;
  };

  private setProducts(products: IProduct[]) {
    this.products = products;
    this.productsOptionsService.addProducts(this.products);
    this.priceRangeService.addProducts(this.products);
  }

  public async getProducts({
    filters,
    collectionIds,
    sorting,
    shouldSpecificCollectionQuery,
    limit,
    isSplitToBatchesEnabled,
  }: {
    filters: ProductFilters;
    collectionIds: ICollectionIdsFilterDTO;
    sorting?: ISorting;
    shouldSpecificCollectionQuery?: boolean;
    limit?: number;
    isSplitToBatchesEnabled?: boolean;
  }): Promise<IProduct[]> {
    let response: GetProductsResponse;

    if (isSplitToBatchesEnabled) {
      const request = {
        offset: 0,
        limit: limit || this.productsPerPage,
        collectionId: shouldSpecificCollectionQuery ? collectionIds.subCategory : collectionIds.mainCategory,
        withOptions: this.withOptions,
        withPriceRange: this.withPriceRange,
        sorting,
        filters: shouldSpecificCollectionQuery ? null : filters,
      };

      const mergeGetProductsResponses = (responseA: GetProductsResponse, responseB: GetProductsResponse) => {
        responseA.list = responseA.list.concat(responseB.list);
        return responseA;
      };

      response = await this.fetchQueryWithBatches<GetProductsRequest, GetProductsResponse>({
        request,
        fetchingFunction: (req: GetProductsRequest) => this.dataApi.getProductsByOffset(req),
        mergingFunction: mergeGetProductsResponses,
      });
    } else {
      const request = {
        fromIndex: 0,
        toIndex: limit || this.productsPerPage,
        collectionId: shouldSpecificCollectionQuery ? collectionIds.subCategory : collectionIds.mainCategory,
        withOptions: this.withOptions,
        withPriceRange: this.withPriceRange,
        sorting,
        filters: shouldSpecificCollectionQuery ? null : filters,
      };

      response = await this.dataApi.getProducts(request);
    }

    this.totalCount = response.totalCount;
    this.setProducts(response.list);
    this.filters = filters;
    this.collectionIds = collectionIds;
    this.sorting = sorting;
    this.sendTrackEvent(0);
    return this.products;
  }

  public handleProductsOptionsChange({productId, selectionIds}: {productId: string; selectionIds: number[]}): void {
    const product = this.products.find((p) => p.id === productId);

    this.productsOptionsService.handleUserInput(product.id, selectionIds);
    this.priceRangeService.handleUserInput(product.id, selectionIds);
  }

  public async oldGetInitialData(options: Omit<IOldGetInitialData, 'withPriceRange'>): Promise<GetDataQuery> {
    const {data} = await this.dataApi.oldGetInitialData({
      ...options,
      limit: this.productsPerPage,
      withPriceRange: this.withPriceRange,
    });
    return this.initState(data);
  }

  private async fetchQueryWithBatches<R extends {limit?: number; offset?: number}, S>({
    request,
    fetchingFunction,
    mergingFunction,
  }: {
    request: R;
    fetchingFunction: (r: R) => Promise<S>;
    mergingFunction: (s1: S, s2: S) => S;
  }) {
    const {limit, offset} = request;

    const responsesPromises: Promise<S>[] = [];

    const totalProducts = limit - offset;
    const batches = Math.floor(totalProducts / BATCH_MAX_SIZE);
    let currentOffset = offset;

    for (let i = 0; i < batches; i++) {
      const batchOption = {
        ...request,
        limit: BATCH_MAX_SIZE,
        offset: currentOffset,
      };
      responsesPromises.push(fetchingFunction(batchOption));
      currentOffset += BATCH_MAX_SIZE;
    }

    const remainder = totalProducts % BATCH_MAX_SIZE;
    if (remainder) {
      const batchOption = {
        ...request,
        limit: remainder,
        offset: currentOffset,
      };
      responsesPromises.push(fetchingFunction(batchOption));
    }

    const response = await Promise.all(responsesPromises);

    return response.reduce(mergingFunction);
  }

  private async fetchInitialDataWithBatch(options: IGetInitialData, isSplitToBatchesEnabled: boolean) {
    if (isSplitToBatchesEnabled) {
      const maxLimit = Math.min(options.limit, MAX_PRODUCTS_BATCHING);
      options.limit = maxLimit;

      const mergeGetInitialDataResponses = (responseA: {data: GetDataQuery}, responseB: {data: GetDataQuery}) => {
        /* istanbul ignore next: hypothetical case + temporal code */
        if (responseB.data.catalog.category === null) {
          return responseA;
        }

        responseA.data.catalog.category.productsWithMetaData.list =
          responseA.data.catalog.category.productsWithMetaData.list.concat(
            responseB.data.catalog.category.productsWithMetaData.list
          );

        return responseA;
      };

      return this.fetchQueryWithBatches<
        IGetInitialData,
        {
          data: GetDataQuery;
        }
      >({
        request: options,
        fetchingFunction: (request: IGetInitialData) => this.dataApi.getInitialData(request),
        mergingFunction: mergeGetInitialDataResponses,
      });
    }

    return this.dataApi.getInitialData(options);
  }

  public async getInitialData(
    options: Omit<IGetInitialData, 'withOptions' | 'withPriceRange'>,
    isSplitToBatchesEnabled: boolean
  ): Promise<GetDataQuery> {
    let limit;
    if (options.limit) {
      limit = options.limit;
    } else {
      limit = this.productsPerPage;
    }

    const optionsWithOverrides = {
      ...options,
      limit,
      withOptions: this.withOptions,
      withPriceRange: this.withPriceRange,
    };

    let data;
    if (this.shouldUseWarmupData) {
      const optionsWithOverridesAsString = Object.keys(optionsWithOverrides)
        .filter((option) => !!optionsWithOverrides[option])
        .map((option) => `${option}=${optionsWithOverrides[option]}`)
        .join('_');
      const key = `gallery_${this.siteStore.getCurrentCurrency()}_${optionsWithOverridesAsString}`;
      const maybeWarmupData = this.siteStore.windowApis.warmupData.get(key);
      if (maybeWarmupData) {
        data = maybeWarmupData;
      } else {
        data = (await this.fetchInitialDataWithBatch(optionsWithOverrides, isSplitToBatchesEnabled)).data;
        this.siteStore.windowApis.warmupData.set(key, data);
      }
    } else {
      data = (await this.fetchInitialDataWithBatch(optionsWithOverrides, isSplitToBatchesEnabled)).data;
    }
    return this.initState(data);
  }

  public async getRelatedItems(options: {
    externalId: string;
    productIds: string[];
  }): Promise<Pick<GetDataQuery, 'catalog' | 'appSettings'>> {
    const {data} = await this.dataApi.getRelatedItems({
      ...options,
      withPriceRange: this.withPriceRange,
    });
    const parsedData: Pick<GetDataQuery, 'catalog' | 'appSettings'> = {
      catalog: {
        category: {
          productsWithMetaData: {
            list: data.catalog.relatedProducts,
            totalCount: 16,
          },
          name: '',
          id: '',
        },
      },
      appSettings: data.appSettings,
    };
    this.initState(parsedData);
    return parsedData;
  }

  private initState(data: GetDataQuery): GetDataQuery {
    if (data.catalog.category === null) {
      data.catalog.category = {productsWithMetaData: {list: [], totalCount: 0}, id: '', name: ''};
      this.hideGallery = true;
    }

    this.setProducts(data.catalog.category.productsWithMetaData.list);
    this.collectionName = data.catalog.category.name;
    this.totalCount = data.catalog.category.productsWithMetaData.totalCount;
    this.collectionIds = {mainCategory: data.catalog.category.id};
    this.sendTrackEvent(0);
    return data;
  }

  public sendTrackEvent(fromIndex: number): void {
    if (this.siteStore.isSSR()) {
      return;
    }

    const items: IAddProductImpression[] = this.products.slice(fromIndex).map((p, i) => ({
      id: p.id,
      name: p.name,
      list: this.consumerName,
      category: TRACK_EVENT_COLLECTION,
      position: i + fromIndex,
      price: p.comparePrice || p.price,
      currency: this.siteStore.currency,
      dimension3: p.isInStock ? 'in stock' : 'out of stock',
    }));

    this.siteStore.windowApis.trackEvent('AddProductImpression', {
      appDefId: APP_DEFINITION_ID,
      contents: items,
      origin: 'Stores',
    });
  }

  public hasMoreProductsToLoad(): boolean {
    return this.products.length < this.totalCount;
  }

  public setProductsPerPage(productsPerPage: number): void {
    this.productsPerPage = productsPerPage;
  }

  public getProductPerPage(): number {
    return this.productsPerPage;
  }

  public setWithOptions(withOptions: boolean): void {
    this.withOptions = withOptions;
  }

  private removeNotUIVisibleProducts(visibleProducts: number) {
    if (visibleProducts !== this.products.length) {
      this.setProducts(this.products.slice(0, visibleProducts));
    }
  }

  public getProduct(id: string): IProduct {
    return this.products.filter((p) => p.id === id)[0];
  }

  public async getCategoryProducts({compId, limit, offset}: IGetCategoryProducts): Promise<void> {
    const {data} = await this.dataApi.getCategoryProducts({
      compId,
      limit,
      offset,
      withOptions: false,
      withPriceRange: this.withPriceRange,
    });
    const retrievedProducts = data.catalog.category.productsWithMetaData.list;
    this.products.splice(offset, retrievedProducts.length, ...retrievedProducts);
    this.setProducts(this.products);
  }

  public async loadMoreProducts(visibleProducts: number, shouldSpecificCollectionQuery?: boolean): Promise<IProduct[]> {
    this.removeNotUIVisibleProducts(visibleProducts);
    const apiResponse = await this.dataApi.getProducts({
      fromIndex: visibleProducts,
      toIndex: visibleProducts + this.productsPerPage,
      withOptions: this.withOptions,
      withPriceRange: this.withPriceRange,
      sorting: this.sorting,
      filters: shouldSpecificCollectionQuery ? null : this.filters,
      collectionId: shouldSpecificCollectionQuery ? this.collectionIds.subCategory : this.collectionIds.mainCategory,
    });
    if (apiResponse.list.length === 0) {
      return null;
    }
    this.setProducts(this.products.concat([...apiResponse.list]));
    this.sendTrackEvent(visibleProducts);
    return this.products;
  }

  public async loadProducts(from: number, to: number, shouldSpecificCollectionQuery?: boolean): Promise<IProduct[]> {
    const apiResponse = await this.dataApi.getProducts({
      fromIndex: from,
      toIndex: to,
      withOptions: this.withOptions,
      withPriceRange: this.withPriceRange,
      sorting: this.sorting,
      filters: shouldSpecificCollectionQuery ? null : this.filters,
      collectionId: shouldSpecificCollectionQuery ? this.collectionIds.subCategory : this.collectionIds.mainCategory,
    });
    this.setProducts([...apiResponse.list]);
    return this.products;
  }

  public async sortProducts(
    sorting: ISorting,
    shouldSpecificCollectionQuery: boolean,
    isSplitToBatchesEnabled: boolean
  ): Promise<IProduct[]> {
    await this.getProducts({
      filters: this.filters,
      collectionIds: this.collectionIds,
      sorting,
      shouldSpecificCollectionQuery,
      isSplitToBatchesEnabled,
    });
    return this.products;
  }

  public async filterProducts({
    filters,
    collectionIds,
    shouldSpecificCollectionQuery,
    limit,
    isSplitToBatchesEnabled,
  }: {
    filters: ProductFilters;
    collectionIds: ICollectionIdsFilterDTO;
    shouldSpecificCollectionQuery: boolean;
    limit?: number;
    isSplitToBatchesEnabled: boolean;
  }): Promise<IProduct[]> {
    this.setProducts(
      await this.getProducts({
        filters,
        collectionIds,
        sorting: this.sorting,
        shouldSpecificCollectionQuery,
        limit,
        isSplitToBatchesEnabled,
      })
    );
    return this.products;
  }

  public getMainCollectionId(): string {
    return this.collectionIds.mainCategory;
  }

  public storeNavigation(pageId: string): void {
    const paginationMap = this.products.map((p) => p.urlPart);
    const history: IStoreFrontNavigationContext = {
      pageId,
      paginationMap,
    };
    this.siteStore.storage.local.setItem(STORAGE_PAGINATION_KEY, JSON.stringify(history));
  }

  public quickViewProduct(
    productId: string,
    index: number,
    compId?: string,
    externalId?: string,
    selectionIds?: number[],
    quantity?: number
  ): Promise<any> {
    const product = this.getProduct(productId);
    this.siteStore.biLogger.clickedOnProductQuickViewSf({
      productId,
      hasRibbon: !!product.ribbon,
      hasOptions: this.hasOptions(product),
      index,
    });
    this.sendClickTrackEvent(product, index);
    return this.quickViewActions.quickViewProduct({
      origin: this.consumerName.split(' ').join('-'),
      urlPart: product.urlPart,
      compId,
      externalId,
      selectionIds,
      quantity,
      title: product.name,
    });
  }

  public sendClickTrackEvent(product: IProduct, index: number): void {
    this.siteStore.windowApis.trackEvent('ClickProduct', {
      appDefId: APP_DEFINITION_ID,
      id: product.id,
      origin: 'Stores',
      name: product.name,
      list: 'Grid Gallery',
      category: TRACK_EVENT_COLLECTION,
      position: index,
      price: product.comparePrice || product.price,
      currency: this.siteStore.currency,
      type: product.productType,
      sku: product.sku,
    });
  }

  private readonly hasOptions = (product: IProduct) => !!product.options.length;

  private readonly hasSubscriptionPlans = (product: IProduct) => {
    return hasSubscriptionPlans(product);
  };

  private readonly flatAndEnrichSelections = (productOptions: IProductOption[]): ReducedOptionSelection[] =>
    _.flatten(
      productOptions.map(({selections, key: optionKey, id: optionId}) =>
        selections.map<ReducedOptionSelection>(({key: selectionKey, id: selectionId}) => ({
          selectionKey,
          selectionId,
          optionId,
          optionKey,
        }))
      )
    );
  private readonly calculateVariantOptions = (selectionIds: number[], product: IProduct): Record<string, string> => {
    const selectionSet = selectionIds.reduce((set, id) => set.add(id), new Set());
    return this.flatAndEnrichSelections(product.options)
      .filter((enrichedSelection) => selectionSet.has(enrichedSelection.selectionId))
      .reduce((acc, enrichedSelection) => {
        acc[enrichedSelection.optionKey] = enrichedSelection.selectionKey;
        return acc;
      }, {});
  };

  private getAddToCartActionBi(addToCartAction: AddToCartActionOption, shouldNavigateToCart: boolean) {
    if (!shouldNavigateToCart && addToCartAction === AddToCartActionOption.TINY_CART) {
      return 'tiny-cart';
    } else if (!shouldNavigateToCart && addToCartAction === AddToCartActionOption.MINI_CART) {
      return 'mini-cart';
    } else if (
      addToCartAction === AddToCartActionOption.CART ||
      (shouldNavigateToCart && addToCartAction !== AddToCartActionOption.NONE)
    ) {
      return 'cart';
    } else {
      return 'none';
    }
  }

  public async addToCart({
    productId,
    index,
    quantity,
    compId,
    externalId,
    addToCartAction,
  }: {
    productId: string;
    index: number;
    quantity: number;
    compId: string;
    externalId: string;
    addToCartAction: AddToCartActionOption;
  }): Promise<any> {
    const product = this.getProduct(productId);
    const trackParams = this.getTrackEventParams(product);
    const optionsSelectionsIds = this.productsOptionsService.getVariantSelectionIds(productId);
    const shouldOpenQuickView =
      !this.productsOptionsService.canAddToCart(productId) || this.hasSubscriptionPlans(product);

    if (shouldOpenQuickView) {
      this.siteStore.biLogger.clickAddToCartWithOptionsSf({
        appName: 'galleryApp',
        origin,
        hasOptions: true,
        productId,
        productType: product.productType,
        navigationClick: this.siteStore.isMobile() ? 'product-page' : 'quick-view',
      });
      return this.quickViewProduct(productId, index, compId, externalId, optionsSelectionsIds, quantity);
    }

    const optionsSelectionsByNames = this.calculateVariantOptions(optionsSelectionsIds, product);
    const shouldNavigateToCart = this.cartActions.shouldNavigateToCart();
    const variant = getProductVariantBySelectionIds({product, variantSelectionIds: optionsSelectionsIds});

    this.siteStore.windowApis.trackEvent(TrackEvents.ViewContent, trackParams);
    this.fedopsLogger.interactionStarted(FedopsInteraction.AddToCart);

    return this.cartActions.addToCart(
      {
        addToCartAction,
        onSuccess: () => this.fedopsLogger.interactionEnded(FedopsInteraction.AddToCart),
        optionsSelectionsByNames,
        optionsSelectionsIds,
        productId,
        quantity,
        variantId: variant?.id,
      },
      {
        ...trackParams,
        buttonType: BiButtonActionType.AddToCart,
        appName: 'galleryApp',
        productType: product.productType as any,
        isNavigateCart: shouldNavigateToCart,
        navigationClick: this.getAddToCartActionBi(addToCartAction, shouldNavigateToCart),
      }
    );
  }

  private getTrackEventParams(product: IProduct) {
    const variantSelectionIds = this.productsOptionsService.getVariantSelectionIds(product.id);
    const variant = getProductVariantBySelectionIds({product, variantSelectionIds}) as IOptionSelectionVariant;
    return {
      ...trackEventMetaData,
      id: product.id,
      name: product.name,
      price: actualPrice(product, variant),
      currency: this.siteStore.currency,
      sku: actualSku(product, variant),
      type: product.productType,
    };
  }

  public clearSelections() {
    this.productsOptionsService.clearSelections();
    this.priceRangeService.clearSelections();
  }

  public getVariantInfoMap(): ProductsVariantInfoMap {
    return this.productsOptionsService.getVariantInfoMap();
  }

  public get productPriceRangeMap(): ProductsPriceRangeServiceMap {
    return this.withPriceRange ? this.priceRangeService.getProductPriceRangeMap() : {};
  }
}
