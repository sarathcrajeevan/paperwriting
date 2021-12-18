import { TitleAndTaglineViewModel } from '../title-and-tagline-view-model/titleAndTaglineViewModel';
import { ConferencePlatform } from '@wix/bookings-uou-types/dist/src';

export class TitleAndTaglineViewModelBuilder {
  viewModel: TitleAndTaglineViewModel = {
    title: 'this is title',
  };
  withTitle(title: string) {
    this.viewModel.title = title;
    return this;
  }
  withTagline(tagline: string) {
    this.viewModel.tagline = tagline;
    return this;
  }
  withOnlineProvider(onlineProvider: ConferencePlatform) {
    this.viewModel.onlineProvider = onlineProvider;
    return this;
  }
  build(): TitleAndTaglineViewModel {
    return this.viewModel;
  }
}
