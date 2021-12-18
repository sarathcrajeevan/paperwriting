import { DescriptionSectionViewModel } from '../description-section-view-modal/descriptionSectionViewModel';

export class DescriptionSectionViewModelBuilder {
  viewModel: DescriptionSectionViewModel = {
    description: 'some Description',
    isBookable: true,
  };

  withBookOnlineAllowed(isBookable: boolean) {
    this.viewModel.isBookable = isBookable;
    return this;
  }

  withDescription(description: string) {
    this.viewModel.description = description;
    return this;
  }

  build(): DescriptionSectionViewModel {
    return this.viewModel;
  }
}
