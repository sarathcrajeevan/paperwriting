import {
  createSettingsParams,
  SettingsParamType,
} from '@wix/yoshi-flow-editor/tpa-settings';

export type ISettingsParams = {
  showCoverPhoto: SettingsParamType.Boolean;
  showFollowButton: SettingsParamType.Boolean;
};

export default createSettingsParams<ISettingsParams>({
  showCoverPhoto: {
    type: SettingsParamType.Boolean,
    getDefaultValue: () => true,
  },
  showFollowButton: {
    type: SettingsParamType.Boolean,
    getDefaultValue: () => true,
  },
});
