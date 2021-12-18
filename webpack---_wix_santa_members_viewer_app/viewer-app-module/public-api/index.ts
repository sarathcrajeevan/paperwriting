import { SOCIAL_APPS, USER_NAME_PATTERN } from '../constants';
import { toMonitored } from '../utils/monitoring';
import { parseConfigItems } from '../config-items-parser';
import { getMemoryStorage } from '../services/memory-storage';
import { getMembersLoginWidgets } from '../services/state';
import { getNavigatableHomePage } from '../services/navigation';
import { renderMembersMenus, renderEmptyMemberMenus } from '../services/menu-renderer';
import {
  CacheService,
  Callback,
  Config,
  MemberInfo,
  RawRouter,
  ReturnedRouterData,
  SectionData,
  WixCodeApi,
} from '../common/types';
import { UserService } from '../services/user';

const noop = () => {};

export class PublicAPI {
  wixLocation: WixCodeApi['location'];
  wixSite: WixCodeApi['site'];
  isMobile: boolean;
  appRouters: RawRouter[];
  routerReturnedData?: ReturnedRouterData;
  wixCodeApi: WixCodeApi;
  cacheService: CacheService;

  constructor({
    appRouters,
    routerReturnedData,
    wixCodeApi,
    cacheService,
  }: {
    appRouters: RawRouter[];
    routerReturnedData?: ReturnedRouterData;
    wixCodeApi: WixCodeApi;
    cacheService: CacheService;
  }) {
    this.wixLocation = wixCodeApi.location;
    this.wixSite = wixCodeApi.site;
    this.isMobile = wixCodeApi.window.formFactor === 'Mobile';
    this.appRouters = appRouters;
    this.routerReturnedData = routerReturnedData;
    this.wixCodeApi = wixCodeApi;
    this.cacheService = cacheService;
  }

  private matchRoute({
    appDefinitionId,
    sectionId,
    onSuccess = noop,
    onError = noop,
  }: {
    appDefinitionId: string;
    sectionId: string;
    onSuccess: Callback;
    onError: Callback;
  }) {
    if (!appDefinitionId || !sectionId) {
      onError('Error: please provide app ID and section ID for navigation');
    }
    let foundRoute = false;
    this.appRouters.forEach((router) => {
      if (foundRoute) {
        return;
      }
      const config = JSON.parse(router.config);
      return (
        config.patterns &&
        Object.keys(config.patterns).forEach((pattern) => {
          if (foundRoute) {
            return;
          }
          const item = config.patterns[pattern];
          if (
            item.appData &&
            item.appData.appDefinitionId === appDefinitionId &&
            item.appData.appPageId === sectionId
          ) {
            foundRoute = true;
            onSuccess(router.prefix, pattern);
          }
        })
      );
    });

    // look in site pages, not member app routes
    if (!foundRoute) {
      const sitePages = this.wixSite.getSiteStructure().pages;
      const pages = sitePages || [];
      const page = pages.filter((pg: any) => pg.applicationId === appDefinitionId && !pg.prefix).pop();

      if (page) {
        foundRoute = true;
        return onSuccess('', page.url);
      }

      return onError(`Error: can not resolve route for app ${appDefinitionId} and page ${sectionId}`);
    }
  }

  private getRouterOptions(appParams: Config['appParams']) {
    const parsedRouters = (appParams.appRouters || []).map((router) => ({
      ...router,
      config: JSON.parse(router.config),
    }));
    const parsedRoutersConfigs = parsedRouters.map((router) => router.config);
    const publicRouter = parsedRouters.find((router) => router.config.type === 'public');
    const publicRouterPrefix = publicRouter!.prefix; // We should always have public router

    return { publicRouterPrefix, parsedRoutersConfigs };
  }

  private getMenuRenderOptions({
    config,
    userService,
    appsCounters,
    enablePreview,
  }: {
    config: Config;
    userService: UserService;
    appsCounters: any;
    enablePreview: boolean;
  }) {
    const { $w, appParams } = config;
    const { parsedRoutersConfigs, publicRouterPrefix } = this.getRouterOptions(appParams);
    const viewedUser = userService.getViewedUser();
    const emptyId = '00000000-0000-0000-0000-000000000000';

    return {
      $w,
      wixCodeApi: this.wixCodeApi,
      publicRouterPrefix,
      parsedRoutersConfigs,
      appsCounters,
      memoryStorage: getMemoryStorage(),
      parsedConfigItems: parseConfigItems(config.config), // TODO: questionable place, was changed from 'config' to 'config.config'
      currentUser: userService.getCurrentUser(),
      viewedUser: enablePreview ? { ...viewedUser, id: emptyId } : viewedUser,
      viewedUserRoles: userService.getRoles()[viewedUser.id] || [],
      isMobile: this.isMobile,
    };
  }

  private hasSocialApp(page: { applicationId: string }) {
    const { applicationId } = page;
    return SOCIAL_APPS.indexOf(applicationId) > -1;
  }

  hasSocialPages(onSuccess: Callback, onError: Callback): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!this.appRouters) {
        if (onError) {
          onError('App routers not initialised');
        }
        return reject('App routers not initialised');
      }

      const socialPages = this.appRouters.filter((router) => {
        const routerConfig = JSON.parse(router.config);
        return routerConfig.type === 'public' && routerConfig.patterns && Object.keys(routerConfig.patterns).length > 0;
      });
      const { pages: sitePages } = this.wixSite.getSiteStructure();
      const socialApps = sitePages.filter(this.hasSocialApp);
      if (onSuccess) {
        onSuccess(socialPages.length > 0 || socialApps.length > 0);
      }
      resolve(socialPages.length > 0 || socialApps.length > 0);
    });
  }

  getViewedUser(onSuccess: Callback, onError: Callback) {
    return new Promise((resolve, reject) => {
      const viewedUser = this.routerReturnedData?.memberData.memberContactId;

      if (viewedUser) {
        if (onSuccess) {
          onSuccess(viewedUser);
        }
        resolve(viewedUser);
      } else {
        if (onError) {
          onError('Error getting viewed user');
        }
        reject('Error getting viewed user');
      }
    });
  }

  navigateToSection({ appDefinitionId, sectionId, tpaInnerRoute = '', memberId = '' }: SectionData, onError: Callback) {
    return new Promise<void>((resolve, reject) => {
      this.matchRoute({
        appDefinitionId,
        sectionId,
        onSuccess: (prefix, suffix) => {
          if (prefix && prefix.indexOf('/') !== 0) {
            prefix = `/${prefix}`;
          }

          if (tpaInnerRoute && tpaInnerRoute.charAt(0) !== '/') {
            tpaInnerRoute = '/' + tpaInnerRoute;
          }

          this.wixLocation.to(
            `${prefix}${memberId ? suffix.replace(USER_NAME_PATTERN, memberId) : suffix}${tpaInnerRoute}`,
          );
          resolve();
        },
        onError: (reason) => {
          if (onError) {
            onError(reason);
          }
          reject(reason);
        },
      });
    });
  }

  getSectionUrl(
    {
      appDefinitionId,
      sectionId,
      memberId = '',
      memberSlug,
    }: { appDefinitionId: string; sectionId: string; memberId?: string; memberSlug?: string },
    callBack: Callback,
  ) {
    return new Promise((resolve, reject) => {
      const userIndicator = memberSlug || memberId;
      this.matchRoute({
        appDefinitionId,
        sectionId,
        onSuccess: (prefix, suffix) => {
          if (prefix && prefix.indexOf('/') === 0) {
            prefix = prefix.substring(1);
          }

          if (!prefix && suffix.indexOf('/') === 0) {
            suffix = suffix.substring(1);
          }

          let baseUrl = this.wixLocation.baseUrl;
          if (baseUrl.slice(-1) !== '/') {
            baseUrl += '/';
          }

          const queryParams = Object.keys(this.wixLocation.query)
            .map((key) => {
              return `${key}=${this.wixLocation.query[key]}`;
            })
            .join('&');
          if (callBack) {
            callBack(
              `${baseUrl}${prefix}${userIndicator ? suffix.replace(USER_NAME_PATTERN, userIndicator) : suffix}${
                queryParams ? '?' + queryParams : ''
              }`,
            );
          }
          resolve(
            `${baseUrl}${prefix}${userIndicator ? suffix.replace(USER_NAME_PATTERN, userIndicator) : suffix}${
              queryParams ? '?' + queryParams : ''
            }`,
          );
        },
        onError: () => {
          console.error('Route not found for app', appDefinitionId, 'and section', sectionId);
          if (callBack) {
            callBack(this.wixLocation.url);
          }
          reject(this.wixLocation.url);
        },
      });
    });
  }

  getNavigatableRoles() {
    const pageToNavigateTo = getNavigatableHomePage(this.appRouters);
    if (pageToNavigateTo) {
      const navigatableMembersRoles = pageToNavigateTo.pageData.appData?.visibleForRoles ?? [];
      return Promise.resolve({
        navigatableMembersRoles,
        isNavigationAllowed: true,
      });
    } else {
      return Promise.resolve({
        navigatableMembersRoles: [],
        isNavigationAllowed: false,
      });
    }
  }

  navigateToMember({ memberId, memberSlug }: MemberInfo, onError: Callback) {
    return new Promise<void>((resolve, reject) => {
      const userIndicator = memberSlug || memberId;
      if (!memberId) {
        if (onError) {
          onError('Error: please provide site member ID');
        }
        return reject('Error: please provide site member ID');
      }

      const pageToNavigateTo = getNavigatableHomePage(this.appRouters);

      if (pageToNavigateTo) {
        const route = `/${pageToNavigateTo.routerPrefix}${pageToNavigateTo.patternKey.replace(
          USER_NAME_PATTERN,
          userIndicator,
        )}`;
        this.wixLocation.to(route);
      }
      resolve();
    });
  }

  getMemberPagePrefix({ type = 'public' }, onSuccess: Callback, onError: Callback) {
    return new Promise((resolve, reject) => {
      if (!this.appRouters) {
        if (onError) {
          onError(`Can not get prefix for type ${type} - no routers`);
        }
        return reject(`Can not get prefix for type ${type} - no routers`);
      }
      const router = this.appRouters.filter((r) => JSON.parse(r.config).type === type).pop();

      if (!router) {
        if (onError) {
          onError(`Can not get prefix for type ${type}`);
        }
        return reject(`Can not get prefix for type ${type}`);
      }
      if (onSuccess) {
        onSuccess({ type, prefix: router.prefix });
      }
      resolve({ type, prefix: router.prefix });
    });
  }

  setNotificationCount(displayCount: number) {
    const membersLoginWidgets = getMembersLoginWidgets();

    membersLoginWidgets.forEach((widget) => {
      if (widget.navBarItems?.length) {
        widget.navBarItems = [{ ...widget.navBarItems[0], displayCount }];
      }
    });
  }

  enterPublicProfilePreviewMode({ config, userService }: { config: Config; userService: UserService }) {
    const { appParams } = config;
    const viewedUser = userService.getViewedUser();
    const instance = this.wixCodeApi?.site?.getAppToken(appParams.appDefinitionId);

    return Promise.resolve()
      .then(() => {
        return this.cacheService.hasNumbers(instance, viewedUser.id)
          ? this.cacheService.getNumbers(instance, viewedUser.id)
          : userService.fetchMenuCounters(viewedUser, instance);
      })
      .then((appsCounters) => {
        const menuRenderOptions = this.getMenuRenderOptions({
          config,
          userService,
          appsCounters,
          enablePreview: true,
        });
        toMonitored('renderMembersMenuItems', () => renderMembersMenus(menuRenderOptions))();
      });
  }

  leavePublicProfilePreviewMode({ config, userService }: { config: Config; userService: UserService }) {
    const { appParams } = config;
    const viewedUser = userService.getViewedUser();
    const instance = this.wixCodeApi?.site?.getAppToken(appParams.appDefinitionId);

    return Promise.resolve()
      .then(() => {
        return this.cacheService.hasNumbers(instance, viewedUser.id)
          ? this.cacheService.getNumbers(instance, viewedUser.id)
          : userService.fetchMenuCounters(viewedUser, instance);
      })
      .then((appsCounters) => {
        const menuRenderOptions = this.getMenuRenderOptions({
          config,
          userService,
          appsCounters,
          enablePreview: false,
        });
        toMonitored('renderMembersMenuItems', () => renderMembersMenus(menuRenderOptions))();
      });
  }

  clearMenus({ config }: { config: Config }) {
    return Promise.resolve().then(() => renderEmptyMemberMenus(config?.$w));
  }
}
