import { PolicySectionViewModel } from '../policy-section-view-model/policySectionViewModel';

export class PolicySectionViewModelBuilder {
  private viewModel: PolicySectionViewModel = {};

  withCancellationPolicy(cancellationPolicy?: string) {
    this.viewModel.cancellationPolicy = cancellationPolicy;
    return this;
  }
  build(): PolicySectionViewModel {
    return this.viewModel;
  }
}
