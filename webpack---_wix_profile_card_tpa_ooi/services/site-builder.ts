import { Builder, InjectedSite } from '../types';

class SiteBuilder implements Builder<InjectedSite> {
  private settingsTab = null;
  private installedApps = {};
  private isSocial = false;
  private isSocialChat = false;

  build = (): InjectedSite => ({
    settingsTab: this.settingsTab,
    installedApps: this.installedApps,
    isSocial: this.isSocial,
    isSocialChat: this.isSocialChat,
  });

  withIsSocial = (isSocial: boolean) => {
    this.isSocial = isSocial;
    return this;
  };

  withIsSocialChat = (isSocialChat: boolean) => {
    this.isSocialChat = isSocialChat;
    return this;
  };
}

export default SiteBuilder;
