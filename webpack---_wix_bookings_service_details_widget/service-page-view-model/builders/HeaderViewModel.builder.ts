import { HeaderViewModel } from '../header-view-model/headerViewModel';
import { ImageDto } from '@wix/bookings-uou-types';

export class HeaderViewModelBuilder {
  viewModel: HeaderViewModel = {
    title: '',
    isBookable: true,
    isSEO: false,
  };

  withBookOnlineAllowed(isBookable: boolean) {
    this.viewModel.isBookable = isBookable;
    return this;
  }

  withTitle(title: string) {
    this.viewModel.title = title;
    return this;
  }

  withImage(image?: ImageDto) {
    this.viewModel.image = image;
    return this;
  }

  withIsSEO(isSEO: boolean) {
    this.viewModel.isSEO = isSEO;
    return this;
  }

  build() {
    return this.viewModel;
  }
}
