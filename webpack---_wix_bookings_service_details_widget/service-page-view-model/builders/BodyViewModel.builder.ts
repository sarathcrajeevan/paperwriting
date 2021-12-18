import {
  AVAILABILITY_MESSAGE_TYPE,
  BodyViewModel,
} from '../body-view-model/bodyViewModel';

export class BodyViewModelBuilder {
  viewModel: BodyViewModel = {
    isBookable: true,
    timeUntilServiceIsOpen: '',
    serviceName: 'service name',
  };
  withBookOnlineAllowed(isBookable: boolean) {
    this.viewModel.isBookable = isBookable;
    return this;
  }

  withMessageType(messageType: AVAILABILITY_MESSAGE_TYPE) {
    this.viewModel.messageType = messageType;
    return this;
  }

  withServiceName(name: string) {
    this.viewModel.serviceName = name;
    return this;
  }

  build() {
    return this.viewModel;
  }
}
