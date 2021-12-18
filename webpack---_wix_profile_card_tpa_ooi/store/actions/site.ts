import siteSlice, {
  SetInstalledAppsPayload,
  SetIsSocialChatPayload,
  SetSettingsTabPayload,
} from '../slices/site-slice';

export const getSetInstalledAppsAction = (
  installedApps: SetInstalledAppsPayload['installedApps'],
) => siteSlice.actions.setInstalledApps({ installedApps });

export const getSetIsSocialChatAction = (
  isSocialChat: SetIsSocialChatPayload['isSocialChat'],
) => siteSlice.actions.setIsSocialChat({ isSocialChat });

export const getSetSettingsTabAction = (
  settingsTab: SetSettingsTabPayload['settingsTab'],
) => siteSlice.actions.setSettingsTab({ settingsTab });
