import { BadgeType } from '@wix/members-badge-lib';

import {
  Handler,
  InjectedGlobalSettings,
  InjectedSite,
  Nullable,
  PublicMember,
} from '../types';
import { FlowAPI } from '../types/controller';

import GlobalSettingsBuilder from './global-settings-builder';
import MembersService from './members-service';
import BadgesService from './badges-service';
import SettingsService from './settings-service';

interface CreateInitialDataFetchServiceOptions {
  flowAPI: FlowAPI;
  getInstance: Handler<string>;
  services: DataServices;
}

interface DataServices {
  membersService: MembersService;
  badgesService: BadgesService;
  settingsService: SettingsService;
}

interface InitialData {
  currentMember: Nullable<PublicMember>;
  viewedMember: Nullable<PublicMember>;
  installedApps: InjectedSite['installedApps'];
  isSocialChat: InjectedSite['isSocialChat'];
  rolesMap: Nullable<{ [key: string]: { roleName: string } }>;
  badgeList: BadgeType[];
  globalSettings: InjectedGlobalSettings;
}

export default class InitialDataFetchService {
  constructor(
    private readonly flowAPI: FlowAPI,
    private readonly getInstance: Handler<string>,
    private readonly dataServices: DataServices,
  ) {}

  async fetchInitialData(
    currentMemberId: Nullable<string>,
    viewedMemberId: Nullable<string>,
  ): Promise<InitialData> {
    const cacheKey = this.getCacheKey(currentMemberId, viewedMemberId);
    const cachedInitialData = this.getInitialDataFromCache(cacheKey);
    if (cachedInitialData) {
      return cachedInitialData;
    }

    const initialData = await this.getInitialDataFromServices(
      currentMemberId,
      viewedMemberId,
    );

    this.addInitialDataToCache(cacheKey, initialData);

    return initialData;
  }

  clearCache(
    currentMemberId: Nullable<string>,
    viewedMemberId: Nullable<string>,
  ) {
    try {
      const cacheKey = this.getCacheKey(currentMemberId, viewedMemberId);
      return this.getStorage()?.removeItem(cacheKey);
    } catch {}
  }

  private async getInitialDataFromServices(
    currentMemberId: Nullable<string>,
    viewedMemberId: Nullable<string>,
  ): Promise<InitialData> {
    const [
      currentMember,
      viewedMember,
      installedApps,
      isSocialChat,
      rolesMap,
      badgeList,
      globalSettings,
    ] = await Promise.all([
      ...this.getMembers(currentMemberId, viewedMemberId),
      this.getInstalledApps(),
      this.getIsSocialChat(),
      this.getRolesMap(),
      this.getBadges(),
      this.getGlobalSettings(),
    ]);

    return {
      currentMember,
      viewedMember,
      installedApps,
      isSocialChat,
      rolesMap,
      badgeList,
      globalSettings,
    };
  }

  private getMembers(
    currentMemberId: Nullable<string>,
    viewedMemberId: Nullable<string>,
  ): [Promise<Nullable<PublicMember>>, Promise<Nullable<PublicMember>>] {
    const { membersService } = this.dataServices;
    const currentMemberPromise = currentMemberId
      ? membersService.getMember(currentMemberId)
      : Promise.resolve(null);

    if (currentMemberId === viewedMemberId) {
      return [currentMemberPromise, currentMemberPromise];
    }

    const viewedMemberPromise = viewedMemberId
      ? membersService.getMember(viewedMemberId)
      : Promise.resolve(null);

    return [currentMemberPromise, viewedMemberPromise];
  }

  private getInstalledApps() {
    try {
      return this.dataServices.membersService.getInstalledApps();
    } catch {
      return Promise.resolve({});
    }
  }

  private getIsSocialChat() {
    try {
      return this.dataServices.membersService.getIsSocialChat();
    } catch {
      return Promise.resolve(false);
    }
  }

  private getRolesMap() {
    try {
      return this.dataServices.membersService.getRolesMap();
    } catch {
      return Promise.resolve({});
    }
  }

  private getBadges() {
    try {
      return this.dataServices.badgesService.getBadgeList();
    } catch {
      return Promise.resolve([]);
    }
  }

  private getGlobalSettings() {
    try {
      const { viewMode } = this.flowAPI.controllerConfig.wixCodeApi.window;
      return this.dataServices.settingsService.getGlobalSettings(viewMode);
    } catch {
      const globalSettings = new GlobalSettingsBuilder().build();
      return Promise.resolve(globalSettings);
    }
  }

  private getInitialDataFromCache(cacheKey: string) {
    const storageResponse = this.getStorage()?.getItem(cacheKey);

    if (!storageResponse) {
      return null;
    }

    try {
      return JSON.parse(storageResponse);
    } catch {
      return null;
    }
  }

  private addInitialDataToCache(cacheKey: string, initialData: InitialData) {
    try {
      return this.getStorage()?.setItem(cacheKey, JSON.stringify(initialData));
    } catch {}
  }

  private getCacheKey(
    currentMemberId: Nullable<string>,
    viewedMemberId: Nullable<string>,
  ) {
    const [instance] = this.getInstance().split('.');
    const { appDefinitionId } = this.flowAPI.controllerConfig.appParams;
    const memberIds = [currentMemberId, viewedMemberId].filter(Boolean);

    return memberIds.length
      ? `${appDefinitionId}-${memberIds.join('-')}-${instance}`
      : `${appDefinitionId}-${instance}`;
  }

  private getStorage() {
    const { platformAPIs } = this.flowAPI.controllerConfig;
    return platformAPIs?.storage?.memory;
  }
}

export const createInitialDataFetchService = ({
  flowAPI,
  getInstance,
  services,
}: CreateInitialDataFetchServiceOptions) => {
  return new InitialDataFetchService(flowAPI, getInstance, services);
};
