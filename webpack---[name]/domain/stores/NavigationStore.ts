import {NavigationService} from '../services/NavigationService';

export type INavigationStoreConfig = {
  navigationService: NavigationService;
};

export class NavigationStore {
  private readonly navigationService: NavigationService;

  constructor({navigationService}: INavigationStoreConfig) {
    this.navigationService = navigationService;
  }

  public async toProps() {
    return {
      continueShoppingLinkHref: await this.navigationService.getContinueShoppingLinkHref(),
      onContinueShoppingLinkClick: this.navigationService.onContinueShoppingClick,
    };
  }
}
