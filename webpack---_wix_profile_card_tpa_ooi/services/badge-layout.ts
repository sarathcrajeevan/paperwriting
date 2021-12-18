import { Layout, Size } from '@wix/members-badge-lib';

import {
  BadgeLayout,
  BadgeSize,
  NumberStyleParam,
  ComponentSettings,
  ColorStyleParam,
  BooleanStyleParam,
  FontStyleParam,
  InjectedGlobalSettings,
} from '../types';
import { getCornerRadiusBoundaries } from '../common/config/badge-corner-radius';
import {
  defaultButtonColor,
  defaultBadgeLayout,
  defaultBadgeSize,
  defaultBadgeFontTextPreset,
} from '../components/ProfileCard/stylesParams';

type StyleParams = ComponentSettings['styleParams'];

type BadgeLayoutMap = { [key in BadgeLayout]: Layout };

type BadgeSizeMap = { [key in BadgeSize]: Size };

type TextPresets = InjectedGlobalSettings['siteTextPresets'];

type Colors = InjectedGlobalSettings['siteColors'];

const badgeLayoutMap: BadgeLayoutMap = {
  [BadgeLayout.IconOnly]: 'icon-only',
  [BadgeLayout.NameOnly]: 'name-only',
  [BadgeLayout.NameAndIcon]: 'name-icon',
};

const badgeSizeMap: BadgeSizeMap = {
  [BadgeSize.Small]: 'small',
  [BadgeSize.Medium]: 'medium',
  [BadgeSize.Large]: 'large',
};

const getBadgeLayout = (styleParams: StyleParams) => {
  const badgeLayout = styleParams.numbers[NumberStyleParam.BadgeLayout];
  return badgeLayout ?? defaultBadgeLayout;
};

const getBadgeSize = (styleParams: StyleParams) => {
  const badgeSize = styleParams.numbers[NumberStyleParam.BadgeSize];
  return badgeSize ?? defaultBadgeSize;
};

const getBorderRadius = (
  styleParams: StyleParams,
  layout: BadgeLayout,
  size: BadgeSize,
) => {
  const borderRadius = styleParams.numbers[NumberStyleParam.BadgeCornerRadius];
  const borderRadiusBoundaries = getCornerRadiusBoundaries(layout, size);

  return borderRadius ?? borderRadiusBoundaries.max;
};

const getFont = (styleParams: StyleParams, textPresets: TextPresets) => {
  const font = styleParams.fonts[FontStyleParam.BadgeFont];
  const defaultFont = textPresets?.[defaultBadgeFontTextPreset];

  return font?.family ?? defaultFont?.fontFamily ?? '';
};

const getRemainderColor = (styleParams: StyleParams, colors: Colors) => {
  const remainderColor =
    styleParams.colors[ColorStyleParam.ResponsiveMemberNameColor];
  const defaultColor = colors?.find(
    ({ reference }) => reference === defaultButtonColor,
  );

  return remainderColor?.value ?? defaultColor?.value ?? '';
};

const getShowBackground = (styleParams: StyleParams) => {
  const { booleans } = styleParams;
  const showBackground = booleans[BooleanStyleParam.ShowBadgeBackground];

  return showBackground ?? true;
};

export const getBadgeSettingsProps = (
  { styleParams }: ComponentSettings,
  { siteColors, siteTextPresets }: InjectedGlobalSettings,
) => {
  const badgeLayout = getBadgeLayout(styleParams);
  const badgeSize = getBadgeSize(styleParams);

  return {
    layout: badgeLayoutMap[badgeLayout],
    size: badgeSizeMap[badgeSize],
    borderRadius: getBorderRadius(styleParams, badgeLayout, badgeSize),
    font: getFont(styleParams, siteTextPresets),
    remainderColor: getRemainderColor(styleParams, siteColors),
    background: getShowBackground(styleParams),
  };
};
