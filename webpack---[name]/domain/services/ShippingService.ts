import {ControllerFlowAPI} from 'yoshi-flow-editor-runtime/build/cjs/flow-api/ViewerScript';
import {OrderService} from './OrderService';
import {DeliveryType, ProductType} from '../../components/thankYouPage/constants';
import {disableTranslationEscaping} from '../../components/thankYouPage/disableTranslationEscaping';

export type ShippingServiceConfig = {
  flowAPI: ControllerFlowAPI;
  orderService: OrderService;
};

export class ShippingService {
  private readonly flowAPI: ControllerFlowAPI;
  private readonly orderService: OrderService;

  constructor({flowAPI, orderService}: ShippingServiceConfig) {
    this.flowAPI = flowAPI;
    this.orderService = orderService;
  }

  public shouldShowShipping(): boolean {
    return (
      this.orderService.deliveryType === DeliveryType.SHIPPING &&
      this.orderService.hasProductsWithType(ProductType.Physical) &&
      this.orderService.hasShippingCountryNameTranslation
    );
  }

  public getShippingAddress(): string {
    const {company, country, subdivision, city, addressLine, addressLine2, zipCode, phone, fullName} =
      this.orderService.shippingAddress;
    const state = subdivision || '';

    let translatedShippingAddress;
    if (addressLine2) {
      translatedShippingAddress = this.flowAPI.translations.t(
        `thankYou.DELIVERY_ADDRESS_FULL_INCLUDING_ADDRESS_LINE_2`,
        disableTranslationEscaping({
          fullName,
          company,
          addressLine,
          addressLine2,
          city,
          state,
          zipCode,
          country,
          phone,
        })
      );
    } else {
      translatedShippingAddress = this.flowAPI.translations.t(
        `thankYou.DELIVERY_ADDRESS_FULL`,
        disableTranslationEscaping({
          fullName,
          company,
          addressLine,
          city,
          state,
          zipCode,
          country,
          phone,
        })
      );
    }
    return ShippingService.cleanAddress(translatedShippingAddress);
  }

  private static cleanAddress(addressLine: string): string {
    return addressLine
      .split('\n')
      .map((line) =>
        line
          .split(',')
          .filter((word) => !!word.trim())
          .join(',')
      )
      .filter((line) => !!line.trim())
      .join('\n');
  }
}
