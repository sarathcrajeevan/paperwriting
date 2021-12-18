import { IWixStyleParams } from '@wix/yoshi-flow-editor/tpa-settings';

import { InjectedHandlers, MetaData, Nullable } from '../types';
import {
  AppParams,
  ControllerConfig,
  FlowAPI,
  RouterData,
  RouterPublicData,
  WixCodeApi,
  WixExperiments,
  HttpClient,
} from '../types/controller';
import {
  badgesApiAbsoluteBaseUrl,
  badgesApiRelativeBaseUrl,
  membersApiAbsoluteBaseUrl,
  membersApiRelativeBaseUrl,
} from '../constants/urls';
import { aboutAppDefinitionId } from '../constants/app-definition-id';
import { Store } from '../store';
import { SetSitePresetsPayload } from '../store/slices/global-settings-slice';
import {
  getSetBadgeListPayload,
  getSetComponentSettingsAction,
  getSetGlobalSettingsAction,
  getSetInstalledAppsAction,
  getSetIsSocialChatAction,
  getSetRolesMapAction,
  getSetSitePresetsAction,
  getSetUsersAction,
} from '../store/actions';
import {
  getIsOwnProfile,
  isInPage,
  isMemberInCommunity,
} from '../store/selectors';

import InitialDataFetchService from './initial-data-fetch-service';
import BlockMemberService from './block-member-service';
import SettingsService from './settings-service';
import MediaService from './media-service';
import BadgesService from './badges-service';
import MembersService from './members-service';

export interface Services {
  membersService: MembersService;
  badgesService: BadgesService;
  mediaService: MediaService;
  settingsService: SettingsService;
  blockMemberService: BlockMemberService;
}

interface InitPropsOptions {
  currentMemberId: Nullable<string>;
  viewedMemberId: Nullable<string>;
  store: Store;
  initialDataFetchService: InitialDataFetchService;
}

interface OpenProfilePreviewNotificationOptions {
  store: Store;
  flowAPI: FlowAPI;
  experiments: WixExperiments;
  handlers: Pick<InjectedHandlers, 'openPrivateProfilePreviewNotification'>;
}

export const getMetaData = (getInstance: () => string) => {
  const instance = getInstance();
  if (!instance) {
    return null;
  }

  try {
    const [, base64Data] = instance.split('.', 2);
    return JSON.parse(atob(base64Data)) as MetaData;
  } catch {
    return null;
  }
};

export const getMetaSiteId = (
  controllerConfig: ControllerConfig,
  metaData: Nullable<MetaData>,
) => {
  const { bi } = controllerConfig.platformAPIs;
  if (bi?.metaSiteId) {
    return bi.metaSiteId;
  }

  return metaData?.metaSiteId ?? null;
};

const getViewedMemberIdFromRouterData = (routerData?: RouterData) => {
  if (!routerData) {
    return null;
  }

  const { memberData, pageData, publicData } = routerData;
  const viewedMemberIdFromMemberData = memberData?.memberContactId;
  const viewedMemberIdFromPageData = pageData?.memberData?.memberContactId;
  const viewedMemberIdFromPublicData = publicData?.viewedUser?.id;
  const viewedMemberId =
    viewedMemberIdFromMemberData ??
    viewedMemberIdFromPageData ??
    viewedMemberIdFromPublicData;

  return viewedMemberId ?? null;
};

const getViewedMemberIdFromPublicRouterData = (wixCodeApi: WixCodeApi) => {
  const routerData =
    wixCodeApi.window.getRouterPublicData?.<RouterPublicData>();
  const viewedUser = routerData?.viewedUser;

  return viewedUser?.id ?? null;
};

export const getCurrentMemberId = (
  wixCodeApi: WixCodeApi,
  metaData: Nullable<MetaData>,
) => {
  const currentUser = wixCodeApi.user.currentUser;
  const currentUserId = currentUser.loggedIn ? currentUser.id : null;
  return metaData?.siteMemberId ?? currentUserId ?? null;
};

export const getViewedMemberId = (
  { appParams, wixCodeApi }: ControllerConfig,
  metaData: Nullable<MetaData>,
) => {
  const { routerReturnedData: routerData } = appParams as AppParams;
  const currentMemberId = getCurrentMemberId(wixCodeApi, metaData);
  const routerDataViewedMemberId = getViewedMemberIdFromRouterData(routerData);
  const publicRouterDataViewedMemberId =
    getViewedMemberIdFromPublicRouterData(wixCodeApi);

  return (
    routerDataViewedMemberId ??
    publicRouterDataViewedMemberId ??
    currentMemberId ??
    null
  );
};

export const getInstanceFactory = ({
  appParams,
  wixCodeApi,
}: ControllerConfig) => {
  const userInstance = wixCodeApi.user.currentUser.instance;
  const appInstance = appParams.instance;
  let instance = userInstance || appInstance;

  wixCodeApi.site.onInstanceChanged((event) => {
    instance = event.instance;
  }, appParams.appDefinitionId);

  return () => instance;
};

const getServices = (
  useAbsoluteUrl: boolean,
  componentId: string,
  httpClient: HttpClient,
) => {
  const membersServiceBaseUrl = useAbsoluteUrl
    ? membersApiAbsoluteBaseUrl
    : membersApiRelativeBaseUrl;

  const badgesServiceBaseUrl = useAbsoluteUrl
    ? badgesApiAbsoluteBaseUrl
    : badgesApiRelativeBaseUrl;

  const badgesService = new BadgesService(badgesServiceBaseUrl, httpClient);

  const blockMemberService = new BlockMemberService(httpClient);

  const mediaService = new MediaService(httpClient);

  const membersService = new MembersService(membersServiceBaseUrl, httpClient);

  const settingsService = new SettingsService(
    componentId,
    membersServiceBaseUrl,
    httpClient,
  );

  return {
    badgesService,
    blockMemberService,
    mediaService,
    membersService,
    settingsService,
  };
};

export const initServices = (
  componentId: string,
  flowAPI: FlowAPI,
): Services => {
  const useAbsoluteUrl = flowAPI.environment.isSSR;

  const {
    mediaService,
    settingsService,
    badgesService,
    blockMemberService,
    membersService,
  } = getServices(useAbsoluteUrl, componentId, flowAPI.httpClient);

  return {
    membersService,
    badgesService,
    mediaService,
    settingsService,
    blockMemberService,
  };
};

export const setComponentSettings = (
  store: Store,
  settings: IWixStyleParams,
) => {
  const payload = { styleParams: settings as any };
  const action = getSetComponentSettingsAction(payload);

  store.dispatch(action);
};

export const setSitePresets = (
  store: Store,
  sitePresets: SetSitePresetsPayload,
) => store.dispatch(getSetSitePresetsAction(sitePresets));

export const initProps = async ({
  currentMemberId,
  viewedMemberId,
  store,
  initialDataFetchService,
}: InitPropsOptions) => {
  const propsPromise = initialDataFetchService.fetchInitialData(
    currentMemberId,
    viewedMemberId,
  );
  const {
    currentMember,
    viewedMember,
    installedApps,
    isSocialChat,
    rolesMap,
    badgeList,
    globalSettings,
  } = await propsPromise;
  const users = {
    ...(viewedMember && { viewed: viewedMember }),
    current: currentMember,
  };

  store.dispatch(getSetUsersAction(users));
  store.dispatch(getSetBadgeListPayload(badgeList));
  store.dispatch(getSetRolesMapAction(rolesMap));
  store.dispatch(getSetIsSocialChatAction(isSocialChat));
  store.dispatch(getSetInstalledAppsAction(installedApps));
  store.dispatch(getSetGlobalSettingsAction(globalSettings));
};

const shouldTogglePrivateProfileNotification = (
  store: Store,
  flowAPI: FlowAPI,
) => {
  const state = store.getState();
  const { viewed } = state.users;
  const { isViewer, isSSR } = flowAPI.environment;
  const isViewerCSR = isViewer && !isSSR;

  return (
    isViewerCSR &&
    isInPage(flowAPI, aboutAppDefinitionId) &&
    getIsOwnProfile(state) &&
    !isMemberInCommunity(viewed)
  );
};

export const maybeOpenPrivateProfilePreviewNotification = ({
  store,
  flowAPI,
  handlers,
}: OpenProfilePreviewNotificationOptions) => {
  if (shouldTogglePrivateProfileNotification(store, flowAPI)) {
    handlers.openPrivateProfilePreviewNotification();
  }
};
