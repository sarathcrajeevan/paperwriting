import { DetailsSectionViewModel } from '../details-section-view-model/detailsSectionViewModel';

export class DetailsSectionViewModelBuilder {
  viewModel: DetailsSectionViewModel = {
    duration: '',
    durationAria: '',
    price: '',
    isBookable: true,
    ariaPrice: '',
  };

  withBookOnlineAllowed(isBookable: boolean) {
    this.viewModel.isBookable = isBookable;
    return this;
  }
  withDuration(duration: string) {
    this.viewModel.duration = duration;
    return this;
  }
  withAriaDuration(durationAria: string) {
    this.viewModel.durationAria = durationAria;
    return this;
  }
  withPrice(price: string) {
    this.viewModel.price = price;
    return this;
  }
  withAriaPrice(ariaPrice: string) {
    this.viewModel.ariaPrice = ariaPrice;
    return this;
  }
  withLocation(location: string) {
    this.viewModel.location = location;
    return this;
  }
  withLocations(locations?: string[]) {
    this.viewModel.locations = locations;
    return this;
  }
  build(): DetailsSectionViewModel {
    return this.viewModel;
  }
}
