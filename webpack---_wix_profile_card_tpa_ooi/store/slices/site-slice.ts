import { createSlice } from '@reduxjs/toolkit';

import { InjectedSite, Reducer } from '../../types';
import SiteBuilder from '../../services/site-builder';
import { checkIfSiteIsSocial } from '../../services/social-status';

export type SetInstalledAppsPayload = Pick<InjectedSite, 'installedApps'>;

export type SetIsSocialChatPayload = Pick<InjectedSite, 'isSocialChat'>;

export type SetSettingsTabPayload = Pick<InjectedSite, 'settingsTab'>;

const name = 'site';

const initialState = new SiteBuilder().build();

const setInstalledApps: Reducer<InjectedSite, SetInstalledAppsPayload> = (
  state,
  { payload },
) => ({
  ...state,
  installedApps: payload.installedApps,
  isSocial: checkIfSiteIsSocial(payload.installedApps),
});

const setIsSocialChat: Reducer<InjectedSite, SetIsSocialChatPayload> = (
  state,
  { payload },
) => ({ ...state, isSocialChat: payload.isSocialChat });

const setSettingsTab: Reducer<InjectedSite, SetSettingsTabPayload> = (
  state,
  { payload },
) => ({
  ...state,
  settingsTab: payload.settingsTab,
});

const reducers = { setInstalledApps, setIsSocialChat, setSettingsTab };

const siteSlice = createSlice({ name, initialState, reducers });

export default siteSlice;
