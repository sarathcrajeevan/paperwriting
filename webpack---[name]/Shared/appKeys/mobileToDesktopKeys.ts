// define the mobile setting keys that should use the desktop if not defined

import { MobileSettingsKeys, SettingsKeys } from './SettingsKeys';

export const MAX_MOBILE_CARD_SPACING = 60;
export const MAX_MOBILE_BORDER_WIDTH = 5;

const desktopSettingsDefaultsToMobileMap = {
  [SettingsKeys.TEXT_ALIGNMENT]: MobileSettingsKeys.MOBILE_TEXT_ALIGNMENT,
  [SettingsKeys.DISPLAY_IMAGE]: MobileSettingsKeys.MOBILE_DISPLAY_IMAGE,
  [SettingsKeys.DISPLAY_TAG_LINE]: MobileSettingsKeys.MOBILE_DISPLAY_TAG_LINE,
  [SettingsKeys.DISPLAY_DIVIDER]: MobileSettingsKeys.MOBILE_DISPLAY_DIVIDER,
  [SettingsKeys.DISPLAY_PRICE]: MobileSettingsKeys.MOBILE_DISPLAY_PRICE,
  [SettingsKeys.DISPLAY_DURATION]: MobileSettingsKeys.MOBILE_DISPLAY_DURATION,
  [SettingsKeys.DIVIDER_WIDTH]: MobileSettingsKeys.MOBILE_DIVIDER_WIDTH,
  [SettingsKeys.BORDER_WIDTH]: MobileSettingsKeys.MOBILE_BORDER_WIDTH,
  [SettingsKeys.BUTTON_STYLE]: MobileSettingsKeys.MOBILE_BUTTON_STYLE,
  [SettingsKeys.DISPLAY_START_DATE]:
    MobileSettingsKeys.MOBILE_DISPLAY_START_DATE,
  [SettingsKeys.DISPLAY_DAYS_OFFERED]:
    MobileSettingsKeys.MOBILE_DISPLAY_DAYS_OFFERED,
  [SettingsKeys.DISPLAY_BUTTON]: MobileSettingsKeys.MOBILE_DISPLAY_BUTTON,
  [SettingsKeys.DISPLAY_MORE_INFO_LABEL]:
    MobileSettingsKeys.MOBILE_DISPLAY_MORE_INFO_LABEL,
  [SettingsKeys.CATEGORY_BACKGROUND_COLOR]:
    MobileSettingsKeys.MOBILE_CATEGORY_BACKGROUND_COLOR,
  [SettingsKeys.DISPLAY_ONLINE_INDICATION]:
    MobileSettingsKeys.MOBILE_DISPLAY_ONLINE_INDICATION,
};

const mobileSettingsDefaultsToDesktopKeysMap = {
  [MobileSettingsKeys.MOBILE_CARDS_SPACING]: SettingsKeys.CARDS_SPACING,
  [MobileSettingsKeys.MOBILE_IMAGE_SHAPE_OPTION]:
    SettingsKeys.IMAGE_SHAPE_OPTION,
  [MobileSettingsKeys.MOBILE_TEXT_ALIGNMENT]: SettingsKeys.TEXT_ALIGNMENT,
  [MobileSettingsKeys.MOBILE_DISPLAY_IMAGE]: SettingsKeys.DISPLAY_IMAGE,
  [MobileSettingsKeys.MOBILE_DISPLAY_TAG_LINE]: SettingsKeys.DISPLAY_TAG_LINE,
  [MobileSettingsKeys.MOBILE_DISPLAY_DIVIDER]: SettingsKeys.DISPLAY_DIVIDER,
  [MobileSettingsKeys.MOBILE_DISPLAY_PRICE]: SettingsKeys.DISPLAY_PRICE,
  [MobileSettingsKeys.MOBILE_BUTTON_STYLE]: SettingsKeys.BUTTON_STYLE,
  [MobileSettingsKeys.MOBILE_DISPLAY_DURATION]: SettingsKeys.DISPLAY_DURATION,
  [MobileSettingsKeys.MOBILE_DISPLAY_START_DATE]:
    SettingsKeys.DISPLAY_START_DATE,
  [MobileSettingsKeys.MOBILE_DISPLAY_DAYS_OFFERED]:
    SettingsKeys.DISPLAY_DAYS_OFFERED,
  [MobileSettingsKeys.MOBILE_DISPLAY_BUTTON]: SettingsKeys.DISPLAY_BUTTON,
  [MobileSettingsKeys.MOBILE_DISPLAY_MORE_INFO_LABEL]:
    SettingsKeys.DISPLAY_MORE_INFO_LABEL,
  [MobileSettingsKeys.MOBILE_DIVIDER_WIDTH]: SettingsKeys.DIVIDER_WIDTH,
  [MobileSettingsKeys.MOBILE_BORDER_WIDTH]: SettingsKeys.BORDER_WIDTH,
  [MobileSettingsKeys.MOBILE_DISPLAY_ONLINE_INDICATION]:
    SettingsKeys.DISPLAY_ONLINE_INDICATION,
};

const mobileSettingsToDesktopKeysMap = {
  ...mobileSettingsDefaultsToDesktopKeysMap,
};

function mergeSettingsKeys(data, keysMap, forceMerge = false) {
  const res = { ...data };
  Object.keys(keysMap).forEach((sourceKey) => {
    const targetKey = keysMap[sourceKey];
    const decoratedValue = decoratorMappings(
      sourceKey,
      targetKey,
      res[sourceKey],
    );
    if (
      typeof res[sourceKey] !== 'undefined' &&
      (forceMerge || typeof res[targetKey] === 'undefined')
    ) {
      res[targetKey] = decoratedValue;
    } else if (res[targetKey]) {
      res[targetKey] = decoratorMappings(sourceKey, targetKey, res[targetKey]);
    }
  });
  return res;
}

const decoratorMappings = (sourceKey, targetKey, value) => {
  switch (`${sourceKey} -> ${targetKey}`) {
    case `${SettingsKeys.DIVIDER_WIDTH} -> ${MobileSettingsKeys.MOBILE_DIVIDER_WIDTH}`:
    case `${MobileSettingsKeys.MOBILE_DIVIDER_WIDTH} -> ${SettingsKeys.DIVIDER_WIDTH}`:
    case `${SettingsKeys.BORDER_WIDTH} -> ${MobileSettingsKeys.MOBILE_BORDER_WIDTH}`:
    case `${MobileSettingsKeys.MOBILE_BORDER_WIDTH} -> ${SettingsKeys.BORDER_WIDTH}`:
      return value ? Math.min(value, MAX_MOBILE_CARD_SPACING) : value;
    case `${SettingsKeys.CARDS_SPACING} -> ${MobileSettingsKeys.MOBILE_CARDS_SPACING}`:
    case `${MobileSettingsKeys.MOBILE_CARDS_SPACING} -> ${SettingsKeys.CARDS_SPACING}`:
      return value ? Math.min(value, MAX_MOBILE_CARD_SPACING) : value;
    default:
      return value;
  }
};

export const mergeDesktopDefaultsIntoMobile = (settingsData) =>
  mergeSettingsKeys(settingsData, desktopSettingsDefaultsToMobileMap, false);
export const mergeMobileDefaultsIntoDesktop = (settingsData) =>
  mergeSettingsKeys(settingsData, mobileSettingsDefaultsToDesktopKeysMap, true);
export const mergeMobileSettingsIntoDesktop = (settingsData) =>
  mergeSettingsKeys(settingsData, mobileSettingsToDesktopKeysMap, true);
