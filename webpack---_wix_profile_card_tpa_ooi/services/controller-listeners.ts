import { createEventHandler } from '@wix/yoshi-flow-editor/tpa-settings';

import {
  ControllerProps,
  DataHook,
  IFrameEvent,
  InjectedGlobalSettings,
  Nullable,
  SettingsEvent,
  VoidHandler,
  ProfileInfo,
} from '../types';
import {
  CurrentUser,
  FlowAPI,
  RequiredControllerParams,
  WixCodeApi,
  WixExperiments,
} from '../types/controller';
import { RootState } from '../store/root-reducer';
import { bindThunksToStore, Store } from '../store';
import {
  getPatchGlobalSettingsAction,
  getSetSettingsTabAction,
  getSetViewedMemberDetails,
} from '../store/actions';
import { getComputedProps } from '../store/selectors';
import InitialDataFetchService from './initial-data-fetch-service';
import DataSyncService from './data-sync-service';
import { initProps } from './controller-utils';
import { Applications, GetPublicAPI } from './public-api-store';
import { requestLogin } from './login-service';

type PartialGlobalSettings = Partial<InjectedGlobalSettings>;

type MapControllerPropsOptions = RequiredControllerParams & {
  metaSiteId: Nullable<string>;
  state: RootState;
  experiments: WixExperiments;
  dataSyncService: DataSyncService;
  handlers?: ReturnType<typeof bindThunksToStore> & { signUp: VoidHandler };
};

type ControllerPropsWithOptionalHandlers = Omit<ControllerProps, 'handlers'> &
  Pick<MapControllerPropsOptions, 'handlers'>;

type RegisterStoreChangeListenerOptions = RequiredControllerParams & {
  metaSiteId: Nullable<string>;
  store: Store;
  experiments: WixExperiments;
  dataSyncService: DataSyncService;
};

interface RegisterCurrentUserListenerOptions {
  store: Store;
  flowAPI: FlowAPI;
  initialDataFetchService: InitialDataFetchService;
  viewedMemberId: Nullable<string>;
}

interface DataSyncListenerOptions {
  dataSyncService: DataSyncService;
  store: Store;
  getPublicAPI: GetPublicAPI;
  initialDataFetchService: InitialDataFetchService;
  flowAPI: FlowAPI;
}

const getSignUpHandler =
  (wixCodeApi: WixCodeApi, experiments?: WixExperiments) => () => {
    requestLogin(wixCodeApi, experiments);
  };

const mapControllerProps = ({
  metaSiteId,
  state,
  handlers,
  controllerConfig,
  flowAPI,
  dataSyncService,
}: MapControllerPropsOptions): ControllerPropsWithOptionalHandlers => {
  const { users, badges, roles, ...controllerProps } = state;
  const { isRTL, isMobile } = flowAPI.environment;
  const { compId } = controllerConfig;

  return {
    ...controllerProps,
    ...(!!handlers && { handlers }),
    compId,
    metaSiteId,
    member: users.viewed.uid ? users.viewed : null,
    rolesMap: roles.map,
    isRTL,
    isMobile,
    isCurrentUserAuthenticated: !!users.current,
    computed: getComputedProps(flowAPI, state),
    iFrameEvents: dataSyncService.purgeIFrameEvents(),
  };
};

export const registerStoreChangeListener = ({
  metaSiteId,
  store,
  experiments,
  controllerConfig,
  flowAPI,
  dataSyncService,
}: RegisterStoreChangeListenerOptions) => {
  const storeHandlers = bindThunksToStore(store);
  const signUp = getSignUpHandler(controllerConfig.wixCodeApi, experiments);
  const initialProps = mapControllerProps({
    metaSiteId,
    state: store.getState(),
    experiments,
    handlers: { ...storeHandlers, signUp },
    controllerConfig,
    flowAPI,
    dataSyncService,
  });
  controllerConfig.setProps(initialProps);

  store.subscribe(() => {
    const updatedProps = mapControllerProps({
      metaSiteId,
      state: store.getState(),
      experiments,
      controllerConfig,
      flowAPI,
      dataSyncService,
    });
    controllerConfig.setProps(updatedProps);
  });

  return storeHandlers;
};

export const registerCurrentUserListener = ({
  store,
  flowAPI,
  initialDataFetchService,
  viewedMemberId,
}: RegisterCurrentUserListenerOptions) => {
  const { wixCodeApi } = flowAPI.controllerConfig;

  wixCodeApi.user.onLogin(async (authenticatedUser: CurrentUser) => {
    const currentMemberId = authenticatedUser.loggedIn
      ? authenticatedUser.id
      : null;

    await initProps({
      store,
      initialDataFetchService,
      currentMemberId,
      viewedMemberId: viewedMemberId ?? currentMemberId,
    });
  });
};

const registerMyAccountListeners = async (
  store: Store,
  getPublicAPI: GetPublicAPI,
  initialDataFetchService: InitialDataFetchService,
) => {
  const myAccountApi = await getPublicAPI(Applications.MyAccount);

  if (!myAccountApi) {
    return;
  }

  const profileInfoChangeCallback = async (profileInfo: ProfileInfo) => {
    const { users } = store.getState();
    const currentMemberId = users.current?.uid ?? null;
    const viewedMemberId = users.viewed.uid;

    initialDataFetchService.clearCache(currentMemberId, viewedMemberId);

    if (profileInfo.profilePrivacy) {
      await initProps({
        store,
        initialDataFetchService,
        currentMemberId,
        viewedMemberId,
      });
    } else {
      store.dispatch(getSetViewedMemberDetails({ ...profileInfo }));
    }
  };

  myAccountApi.registerToProfileInfoChange(profileInfoChangeCallback);
};

export const registerDataSyncListener = async ({
  store,
  dataSyncService,
  getPublicAPI,
  initialDataFetchService,
  flowAPI,
}: DataSyncListenerOptions) => {
  if (flowAPI.environment.isEditor || flowAPI.environment.isSSR) {
    return;
  }
  await registerMyAccountListeners(
    store,
    getPublicAPI,
    initialDataFetchService,
  );
  dataSyncService.registerListeners(store);
  store.subscribe(() => dataSyncService.emitEvents(store));
};

export const createSettingsListener = (publicData: Object = {}) => {
  return createEventHandler<SettingsEvent>(publicData);
};

export const registerSettingsListeners = ({
  eventHandler,
  dataSyncService,
  store,
}: {
  eventHandler: ReturnType<typeof createSettingsListener>;
  dataSyncService: DataSyncService;
  store: Store;
}) => {
  eventHandler.on('tabChange', (settingsTab: DataHook) => {
    store.dispatch(getSetSettingsTabAction(settingsTab));
  });

  eventHandler.on('globalSettings', (settings: PartialGlobalSettings) => {
    const action = getPatchGlobalSettingsAction(settings);

    store.dispatch(action);
    dataSyncService.emitEvent(action);
    dataSyncService.addIFrameEvent(IFrameEvent.SetGlobalSettings);
  });

  eventHandler.onReset(() => {
    store.dispatch(getSetSettingsTabAction(null));
  });
};
