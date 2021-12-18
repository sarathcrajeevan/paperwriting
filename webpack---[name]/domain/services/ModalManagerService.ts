import {SiteStore} from '@wix/wixstores-client-storefront-sdk/dist/es/src/viewer-script/site-store/SiteStore';
import {ModalManager} from '@wix/wixstores-client-core/dist/es/src/modalManager/modalManager';
import {ControllerParams} from 'yoshi-flow-editor-runtime';

export class ModalManagerService {
  private readonly siteStore: SiteStore;
  public readonly modalManger: ModalManager;

  constructor({siteStore}: {siteStore: SiteStore}, private readonly controllerParams: ControllerParams) {
    this.siteStore = siteStore;
    this.modalManger = new ModalManager(
      {
        openModal: (url: string, width: number, height: number) => {
          return this.siteStore.windowApis.openModal(
            url,
            {width, height, theme: 'BARE'},
            this.controllerParams.controllerConfig.compId
          );
        },
      },
      '//ecom.wix.com',
      this.siteStore.instanceManager.getInstance()
    );
  }
}
