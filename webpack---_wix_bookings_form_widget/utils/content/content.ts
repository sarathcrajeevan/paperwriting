import { ISettingsContextValue } from '@wix/yoshi-flow-editor/tpa-settings';

type GetContentParams = {
  settings: Partial<ISettingsContextValue>;
  settingsParam: any;
};

export const getContent = ({ settings, settingsParam }: GetContentParams) => {
  return (
    settings.get?.(settingsParam) || settings.getDefaultValue?.(settingsParam)
  );
};
