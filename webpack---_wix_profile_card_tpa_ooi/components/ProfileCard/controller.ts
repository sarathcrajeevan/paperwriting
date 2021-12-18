import { CreateControllerFn } from '@wix/yoshi-flow-editor';

import { Interaction, Origin } from '../../types';
import { createPublicAPIStore } from '../../services/public-api-store';
import {
  getInstanceFactory,
  getMetaData,
  getMetaSiteId,
  getCurrentMemberId,
  getViewedMemberId,
  setComponentSettings,
  setSitePresets,
  initServices,
  initProps,
  maybeOpenPrivateProfilePreviewNotification,
} from '../../services/controller-utils';
import { initMonitoringService } from '../../services/monitoring';
import { createDataSyncService } from '../../services/data-sync-service';
import { createInitialDataFetchService } from '../../services/initial-data-fetch-service';
import { ProfileSubject } from '../../services/profile-subject';
import {
  createSettingsListener,
  registerSettingsListeners,
  registerStoreChangeListener,
  registerCurrentUserListener,
  registerDataSyncListener,
} from '../../services/controller-listeners';
import createStore from '../../store';
import { membersTpaLoadedUou } from '@wix/bi-logger-members-app-uou/v2';
import { getCommonBIEventProps } from '../../services/bi-event';

const noop = () => {};

const createController: CreateControllerFn = async ({
  controllerConfig,
  flowAPI,
  appData,
}) => {
  const { compId, appParams, wixCodeApi, platformAPIs } = controllerConfig;
  const { config } = controllerConfig;
  const { experiments, bi: biLogger } = flowAPI;
  const getInstance = getInstanceFactory(controllerConfig);
  const getPublicAPI = createPublicAPIStore(wixCodeApi.site.getPublicAPI);
  const metaData = getMetaData(getInstance);
  const services = initServices(compId, flowAPI);
  const monitoringService = initMonitoringService(flowAPI);
  const settingsListener = createSettingsListener(config.publicData);
  const dataSyncService = createDataSyncService(compId, platformAPIs.pubSub);
  const initialDataFetchService = createInitialDataFetchService({
    flowAPI,
    getInstance,
    services,
  });
  const profileSubject = appData?.profileSubject as ProfileSubject | undefined;

  const store = createStore({
    ...services,
    metaData,
    compId,
    flowAPI,
    wixCodeApi,
    platformAPIs,
    experiments,
    dataSyncService,
    monitoringService,
    initialDataFetchService,
    profileSubject,
    getPublicAPI,
    biLogger,
  });

  return {
    async pageReady() {
      const currentMemberId = getCurrentMemberId(wixCodeApi, metaData);
      const viewedMemberId = getViewedMemberId(controllerConfig, metaData);
      const metaSiteId = getMetaSiteId(controllerConfig, metaData);

      const currentUserListenerOptions = {
        store,
        flowAPI,
        initialDataFetchService,
        viewedMemberId,
      };

      const initPropsOptions = {
        currentMemberId,
        viewedMemberId,
        store,
        initialDataFetchService,
      };

      await monitoringService
        .toMonitored(Interaction.InitialDataLoad, initProps(initPropsOptions))
        .catch(noop);

      const renderWidget = async () => {
        setComponentSettings(store, controllerConfig.config.style.styleParams);
        registerCurrentUserListener(currentUserListenerOptions);
        registerSettingsListeners({
          eventHandler: settingsListener,
          dataSyncService,
          store,
        });
        const storeHandlers = registerStoreChangeListener({
          metaSiteId,
          store,
          experiments,
          controllerConfig,
          flowAPI,
          dataSyncService,
        });
        registerDataSyncListener({
          dataSyncService,
          store,
          getPublicAPI,
          initialDataFetchService,
          flowAPI,
        });

        biLogger?.report(
          membersTpaLoadedUou({
            ...getCommonBIEventProps(flowAPI, store.getState(), metaData),
            origin: Origin.Profile,
            page_name: Origin.Profile,
            widget_name: Origin.Profile,
            widget_id: appParams.appDefinitionId,
            member_id: store.getState()?.users?.viewed?.uid,
            currentPageId:
              flowAPI?.controllerConfig?.wixCodeApi?.site?.currentPage
                ?.applicationId,
          }),
        );

        maybeOpenPrivateProfilePreviewNotification({
          store,
          flowAPI,
          experiments,
          handlers: storeHandlers,
        });
      };

      await monitoringService
        .toMonitored(Interaction.InitialWidgetRender, renderWidget())
        .catch(noop);
    },
    updateConfig(_, { style, publicData }) {
      settingsListener.notify(publicData.COMPONENT || {});

      if (style?.styleParams) {
        const { styleParams, ...sitePresets } = style;
        setComponentSettings(store, style.styleParams);
        setSitePresets(store, sitePresets);
      }
    },
    onBeforeUnLoad() {
      dataSyncService.unregisterListeners();

      if (profileSubject) {
        profileSubject.unregisterObservers();
      }
    },
  };
};

export default createController;
