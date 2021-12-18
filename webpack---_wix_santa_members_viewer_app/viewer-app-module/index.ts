import { HttpClient } from '@wix/http-client';
import { parseConfigItems } from './config-items-parser';
import { init as createUserService, UserService } from './services/user';
import { buildCurrentPath } from './services/location';
import { renderLoginMenus, renderMembersMenus } from './services/menu-renderer';
import { setMobileMembersMenuValue } from './services/menu-renderer-editor';
import { initializeMonitoring, toMonitored, log } from './utils/monitoring';
import { GroupsService, initGroupsService } from './services/groups';
import { getPagesFromRouters } from './services/page-mapper';
import { initInMemoryCacheService } from './services/cache';
import { setMemoryStorage, getMemoryStorage } from './services/memory-storage';
import { initExperiments, WixExperiments } from './services/experiments';
import { getHttpClientFromConfig } from './services/httpClient';
import { PublicAPI } from './public-api';
import {
  CacheService,
  Callback,
  Config,
  Member,
  MemberInfo,
  RawRouter,
  ReturnedRouterData,
  RouterConfig,
  SectionData,
  Storage,
  WixCodeApi,
} from './common/types';

let _config: Config;
let experiments: WixExperiments | null;
let publicApi: PublicAPI;
let userService: UserService;
let groupsService: GroupsService;
let cacheService: CacheService;

const _initAppForPage = (
  {
    appDefinitionId,
    routerReturnedData,
    appRouters = [],
  }: { appDefinitionId: string; routerReturnedData: ReturnedRouterData; appRouters?: RawRouter[] },
  { storage }: { storage: Storage },
  wixCodeApi: WixCodeApi,
) => {
  userService = createUserService(wixCodeApi);
  cacheService = initInMemoryCacheService(storage);
  publicApi = new PublicAPI({ appRouters, routerReturnedData, wixCodeApi, cacheService });
  setMemoryStorage(storage.memory);

  if (!routerReturnedData) {
    return Promise.resolve();
  }

  const instance = wixCodeApi.site.getAppToken(appDefinitionId);
  const slugs = (routerReturnedData.memberData && routerReturnedData.memberData.slugs) || [];
  const viewedUserId =
    (routerReturnedData.memberData && routerReturnedData.memberData.memberContactId) || routerReturnedData.userId;
  const primarySlug = slugs.find((slug) => slug.primary === true);
  const viewedUserSlug = (primarySlug && primarySlug.name) || viewedUserId;
  const viewedUserData: Member = { id: viewedUserId!, slug: viewedUserSlug! };

  userService.setViewedUser(viewedUserData);
  userService.setRoles(routerReturnedData.roles || {});

  if (routerReturnedData.roles) {
    cacheService.setRoles(instance, viewedUserId, routerReturnedData.roles);
  }

  return Promise.resolve();
};

const getMenuCounters = async (instance: string, isSSR: boolean, httpClient: HttpClient) => {
  if (isSSR) {
    return { currentUserCounters: undefined, viewedUserCounters: undefined };
  }

  const currentUser = userService.getCurrentUser();
  const viewedUser = userService.getViewedUser();

  const getUserMenuCounters = async (user: Member) => {
    if (cacheService.hasNumbers(instance, user.id)) {
      return cacheService.getNumbers(instance, user.id);
    }

    const menuCounters = await userService.fetchMenuCounters(user, httpClient);
    cacheService.setNumbers(instance, user.id, menuCounters);

    return menuCounters;
  };

  const isSameSessionUser = viewedUser.id === currentUser.id;
  const currentUserMenuCountersPromise = getUserMenuCounters(currentUser);

  const [currentUserCounters, viewedUserCounters] = await Promise.all([
    currentUserMenuCountersPromise,
    isSameSessionUser ? currentUserMenuCountersPromise : viewedUser.id ? getUserMenuCounters(viewedUser) : {},
  ]);

  return { currentUserCounters, viewedUserCounters };
};

const getRoles = async (instance: string, httpClient: HttpClient) => {
  const currentUser = userService.getCurrentUser();
  const viewedUser = userService.getViewedUser();

  if (cacheService.hasRoles(instance, viewedUser?.id)) {
    return cacheService.getRoles(instance, viewedUser?.id)!;
  }

  const roles = await userService.fetchRoles(viewedUser.id, currentUser.id, httpClient);
  cacheService.setRoles(instance, viewedUser?.id, roles);

  return roles;
};

function fetchAndRenderMenus(config: Config) {
  const { wixCodeApi, appParams, $w } = config;
  const viewedUser = userService.getViewedUser();
  const currentUser = userService.getCurrentUser();
  const userRoles = userService.getRoles();
  const httpClient = getHttpClientFromConfig(config);
  const needToFetchRoles = currentUser.loggedIn! && Object.keys(userRoles).length === 0;
  const santaMembersToken = wixCodeApi.site.getAppToken(appParams.appDefinitionId);
  const isSSR = wixCodeApi.window.rendering.env === 'backend';
  const parsedRouters = (appParams.appRouters || []).map((router) => ({
    ...router,
    config: JSON.parse(router.config),
  }));
  const parsedRoutersConfigs = parsedRouters.map((router) => router.config);

  return Promise.all([
    getMenuCounters(santaMembersToken, isSSR, httpClient),
    needToFetchRoles ? getRoles(santaMembersToken, httpClient) : {},
    groupsService.getPermittedPagesMap(getPagesFromRouters(parsedRouters), wixCodeApi.window.viewMode),
  ]).then(([{ currentUserCounters, viewedUserCounters }, roles, permittedPagesMap]) => {
    if (needToFetchRoles) {
      userService.setRoles(roles);
    }

    const parsedConfigItems = parseConfigItems(config.config);
    const memoryStorage = getMemoryStorage();
    const isMobile = wixCodeApi.window.formFactor === 'Mobile';
    const currentUserRoles = userService.getRoles()[currentUser.id] || [];
    const viewedUserRoles = userService.getRoles()[viewedUser.id] || [];
    const publicRouter = parsedRouters.find((router) => router.config.type === 'public');
    const publicRouterPrefix = publicRouter?.prefix ?? '';

    toMonitored('renderMembersMenuItems', () =>
      renderMembersMenus({
        $w,
        wixCodeApi,
        parsedRoutersConfigs,
        viewedUserRoles,
        viewedUser,
        currentUser,
        appsCounters: viewedUserCounters,
        parsedConfigItems,
        memoryStorage,
        publicRouterPrefix,
        permittedPagesMap,
        experiments,
        isMobile,
      }),
    )();
    toMonitored('renderLoginMenuItems', () =>
      renderLoginMenus({
        $w,
        parsedRoutersConfigs,
        currentUserRoles,
        currentUser,
        appsCounters: currentUserCounters,
        memoryStorage,
        publicRouterPrefix,
        permittedPagesMap,
        experiments,
        isMobile,
      }),
    )();
  });
}

// Old method, making sure whether it is still needed with logs
const redirectIfURLIsInvalid = (config: Config) => {
  const viewedUser = userService.getViewedUser();
  if (config.wixCodeApi.window.viewMode === 'Site') {
    const url = buildCurrentPath(config.wixCodeApi);
    const urlWithSlug = userService.replaceUserPatternWithSlug(url, viewedUser);
    if (url !== urlWithSlug) {
      const tags = { viewerName: config.platformAPIs.bi.viewerName };
      log('Deprecation check: redirect', {
        tags,
        extra: { from: url, to: urlWithSlug },
      });
      config.wixCodeApi.location.to(urlWithSlug);
    }
  }
};

const createPageReady = (config: Config) => () => {
  const { wixCodeApi } = config;
  const httpClient = getHttpClientFromConfig(config);
  _config = config;

  const setUserAndRenderMenus = (user = wixCodeApi.user.currentUser) => {
    return userService.setCurrentUser(user, httpClient).then(() => fetchAndRenderMenus(config));
  };

  wixCodeApi.user.onLogin((loggedInUser: Member) =>
    toMonitored('onLogin', () => setUserAndRenderMenus(loggedInUser))(),
  );

  return initExperiments(config)
    .then((_experiments) => {
      experiments = _experiments;
      groupsService = initGroupsService(httpClient, experiments);
    })
    .then(() => setUserAndRenderMenus())
    .then(() => redirectIfURLIsInvalid(config));
};

const createEditorPageReady = ({ $w, wixCodeApi, appParams }: Config) => async () => {
  const isMobile = wixCodeApi.window.formFactor === 'Mobile';
  const parsedRouters = (appParams.appRouters ?? []).map((router) => ({
    ...router,
    config: JSON.parse(router.config),
  }));

  if (isMobile) {
    setMobileMembersMenuValue($w, wixCodeApi, parsedRouters);
  }
};

const _createControllers = (controllerConfigs: Config[]) => {
  const controllers = controllerConfigs.map((config) => {
    const isInEditor = config.wixCodeApi.window.viewMode === 'Editor';
    const pageReady = isInEditor ? createEditorPageReady(config) : createPageReady(config);

    return { pageReady, exports: {} };
  });

  return controllers;
};

const initAppForPage = (initParams: any, platformApis: any, wixCodeApi: WixCodeApi, platformServices: any) => {
  initializeMonitoring(initParams, platformServices);
  return toMonitored('initAppForPage', () => _initAppForPage(initParams, platformApis, wixCodeApi))();
};

const createControllers = (controllerConfigs: Config[]) =>
  toMonitored('createControllers', () => _createControllers(controllerConfigs))();

const platformExports = {
  hasSocialPages: (onSuccess: Callback, onError: Callback) =>
    toMonitored('publicApi.hasSocialPages', () => publicApi.hasSocialPages(onSuccess, onError))(),
  getViewedUser: (onSuccess: Callback, onError: Callback) =>
    toMonitored('publicApi.getViewedUser', () => publicApi.getViewedUser(onSuccess, onError))(),
  navigateToSection: (sectionData: SectionData, onError: Callback) =>
    toMonitored('publicApi.navigateToSection', () => publicApi.navigateToSection(sectionData, onError))(),
  navigateToMember: (memberInfo: MemberInfo, onError: Callback) =>
    toMonitored('publicApi.navigateToMember', () => publicApi.navigateToMember(memberInfo, onError))(),
  getNavigatableRoles: (onError: Callback) =>
    toMonitored('publicApi.getNavigatableRoles', () => publicApi.getNavigatableRoles())(),
  getSectionUrl: (sectionData: SectionData, onError: Callback) =>
    toMonitored('publicApi.getSectionUrl', () => publicApi.getSectionUrl(sectionData, onError))(),
  getMemberPagePrefix: (data: RouterConfig, onSuccess: Callback, onError: Callback) =>
    toMonitored('publicApi.getMemberPagePrefix ', () => publicApi.getMemberPagePrefix(data, onSuccess, onError))(),
  setNotificationCount: (displayCount: number) =>
    toMonitored('publicApi.setNotificationCount', () => publicApi.setNotificationCount(displayCount))(),
  enterPublicProfilePreviewMode: () =>
    toMonitored('publicApi.enterPublicProfilePreviewMode', () =>
      publicApi.enterPublicProfilePreviewMode({
        userService,
        config: _config,
      }),
    )(),
  leavePublicProfilePreviewMode: () =>
    toMonitored('publicApi.leavePublicProfilePreviewMode', () =>
      publicApi.leavePublicProfilePreviewMode({
        userService,
        config: _config,
      }),
    )(),
  clearMenus: () => toMonitored('publicApi.clearMenus', () => publicApi.clearMenus({ config: _config }))(),
};

export { platformExports as exports, initAppForPage, createControllers };
