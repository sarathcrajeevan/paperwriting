import { Builder, InjectedGlobalSettings, Nullable } from '../types';

class GlobalSettingsBuilder implements Builder<InjectedGlobalSettings> {
  private showFollowers = false;
  private showFollowersMobile = false;
  private defaultProfileCoverUrl: Nullable<string> = null;

  build = (): InjectedGlobalSettings => ({
    showFollowers: this.showFollowers,
    showFollowersMobile: this.showFollowersMobile,
    defaultProfileCoverUrl: this.defaultProfileCoverUrl,
  });

  withShowFollowers = (showFollowers: boolean) => {
    this.showFollowers = showFollowers;
    return this;
  };
}

export default GlobalSettingsBuilder;
