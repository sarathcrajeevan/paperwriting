import { IWidgetControllerConfig } from '@wix/native-components-infra/dist/src/types/types';
import { WixOOISDKAdapter } from '@wix/bookings-adapter-ooi-wix-sdk';

export function createWixSdkAdapter(controllerConfig: IWidgetControllerConfig) {
  return new WixOOISDKAdapter(
    controllerConfig.wixCodeApi,
    controllerConfig.platformAPIs,
    controllerConfig.appParams,
    controllerConfig.compId,
  );
}
