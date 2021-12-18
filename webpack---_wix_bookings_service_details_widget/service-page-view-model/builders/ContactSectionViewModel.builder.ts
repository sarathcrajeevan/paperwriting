import {
  ContactInfoViewModel,
  ContactSectionViewModel,
} from '../contact-section-view-model/contactSectionViewModel';

export class ContactSectionViewModelBuilder {
  viewModel: ContactSectionViewModel = {};

  withPhone(phone: string) {
    this.viewModel.phone = phone;
    return this;
  }
  withEmail(email: string) {
    this.viewModel.email = email;
    return this;
  }
  withAddress(address: string) {
    this.viewModel.address = address;
    return this;
  }
  withContactInfo(contactInfo) {
    this.viewModel.contactInfo = contactInfo;
    return this;
  }
  build(): ContactSectionViewModel {
    return this.viewModel;
  }
}

export class ContactInfoViewModelBuilder {
  contactInfo: ContactInfoViewModel = {};

  withName(name: string) {
    this.contactInfo.name = name;
    return this;
  }
  withPhone(phone: string) {
    this.contactInfo.phone = phone;
    return this;
  }
  withEmail(email: string) {
    this.contactInfo.email = email;
    return this;
  }
  withAddress(address: string) {
    this.contactInfo.address = address;
    return this;
  }
  build(): ContactInfoViewModel {
    return this.contactInfo;
  }
}
