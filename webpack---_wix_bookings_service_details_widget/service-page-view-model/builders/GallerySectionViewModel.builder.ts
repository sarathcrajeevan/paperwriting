import { GallerySectionViewModel } from '../gallery-section-view-model/gallerySectionViewModel';
import { ImageDto } from '@wix/bookings-uou-types/src/service-info.dto';

export class GallerySectionViewModelBuilder {
  private viewModel: GallerySectionViewModel = {
    items: [],
  };

  withItems(items: ImageDto[]) {
    this.viewModel.items = items;
    return this;
  }
  build(): GallerySectionViewModel {
    return this.viewModel;
  }
}
