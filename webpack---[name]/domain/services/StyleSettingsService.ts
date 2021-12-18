import {StyleParam} from '../../components/cart/constants';
import {ICartStyleSettings} from '../../types/app.types';

export class StyleSettingsService {
  constructor(private styleSettings: ICartStyleSettings) {
    //
  }

  public update(styleSettings: ICartStyleSettings) {
    this.styleSettings = styleSettings;
  }

  public get shouldRenderContinueShopping() {
    return this.styleSettings.booleans[StyleParam.ShowContinueShopping] === true;
  }

  public get shouldShowCoupon() {
    return this.styleSettings.booleans[StyleParam.ShowCoupon] === true;
  }

  public get shouldShowBuyerNote() {
    return this.styleSettings.booleans[StyleParam.ShowBuyerNote] === true;
  }

  public get shouldShowTax() {
    return this.styleSettings.booleans[StyleParam.ShowTax] === true;
  }

  public get shouldShowShipping() {
    return this.styleSettings.booleans[StyleParam.ShowShipping] === true;
  }

  public get cornerRadius() {
    return this.styleSettings.fonts[StyleParam.CornerRadius];
  }
  public get dynamicPaymentMethodsTheme() {
    return this.styleSettings.numbers[StyleParam.dynamicPaymentMethodsTheme];
  }
  public get dynamicPaymentMethodsShape() {
    return this.styleSettings.numbers[StyleParam.dynamicPaymentMethodsShape];
  }
  public get selectedSkin() {
    return this.styleSettings.fonts[StyleParam.SelectedSkin];
  }

  public get isEditorX() {
    return this.styleSettings.booleans[StyleParam.Responsive] === true;
  }
}
