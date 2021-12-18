import React from 'react';
import { ChatIcons } from '@wix/inbox-common';
import {
  ReactComponent as SquareTransparent,
  default as SquareTransparentSrc,
} from '../../assets/icons/minimized-chat/square-transparent.svg';
import {
  ReactComponent as SquareFilled,
  default as SquareFilledSrc,
} from '../../assets/icons/minimized-chat/square-filled.svg';
import {
  ReactComponent as CircleTransparent,
  default as CircleTransparentSrc,
} from '../../assets/icons/minimized-chat/circle-transparent.svg';
import {
  ReactComponent as CircleFilled,
  default as CircleFilledSrc,
} from '../../assets/icons/minimized-chat/circle-filled.svg';
import {
  ReactComponent as CircleLegacy,
  default as CircleLegacySrc,
} from '../../assets/icons/minimized-chat/circle-legacy.svg';
import { ReactComponent as Close } from '../../assets/icons/minimized-chat/close.svg';
import { ReactComponent as LegacyMale } from '../../assets/icons/v1/avatarMale.svg';
import { ReactComponent as LegacyFemale } from '../../assets/icons/v1/avatarFemale.svg';
import { ReactComponent as LegacyNoGender } from '../../assets/icons/v1/avatarNoGender.svg';
import { ReactComponent as LegacySmiley } from '../../assets/icons/v1/defaultAvatar.svg';
import { ReactComponent as DefaultLogo } from '../../assets/icons/header/default-logo.svg';

const iconComponents: Record<ChatIcons, (style) => React.ReactElement> = {
  [ChatIcons.SquareTransparent]: (style) => <SquareTransparent style={style} />,
  [ChatIcons.SquareFilled]: (style) => <SquareFilled style={style} />,
  [ChatIcons.CircleTransparent]: (style) => <CircleTransparent style={style} />,
  [ChatIcons.CircleFilled]: (style) => <CircleFilled style={style} />,
  [ChatIcons.Close]: (style) => <Close style={style} />,
  [ChatIcons.LegacyMale]: (style) => <LegacyMale style={style} />,
  [ChatIcons.LegacyFemale]: (style) => <LegacyFemale style={style} />,
  [ChatIcons.LegacyNoGender]: (style) => <LegacyNoGender style={style} />,
  [ChatIcons.LegacySmiley]: (style) => <LegacySmiley style={style} />,
  [ChatIcons.CircleLegacy]: (style) => <CircleLegacy style={style} />,
};

export const icons = Object.keys(iconComponents) as ChatIcons[];

export const isIcon = (icon: ChatIcons | string): icon is ChatIcons =>
  icons.includes(icon as ChatIcons);

export const getIconComponent = (
  icon: ChatIcons,
  fill: string,
  size: string,
  borderRadius: string,
) => {
  const style = {
    borderRadius,
    fill,
    width: size,
    height: size,
    flexShrink: 0,
  };
  const componentFactory = iconComponents[icon];
  return componentFactory && componentFactory(style);
};

export const getImageComponent = (
  src: string | 'default-logo',
  size: string,
  borderRadius?: string,
) => {
  if (src === 'default-logo') {
    return <DefaultLogo style={{ width: size, height: size, flexShrink: 0 }} />;
  }
  return (
    <img
      data-hook="thumbnail-image"
      alt=""
      src={src}
      style={{
        width: size,
        height: size,
        borderRadius,
      }}
    />
  );
};

// Used to pass the svg to the Qab. Ugly but necessary.
export const getIconRawElementString = (
  icon: ChatIcons,
  size: string,
  color: string,
): string | undefined => {
  const style = {
    width: size,
    height: size,
    color,
  };

  const iconSources: Record<string, string> = {
    [ChatIcons.SquareTransparent]: SquareTransparentSrc,
    [ChatIcons.SquareFilled]: SquareFilledSrc,
    [ChatIcons.CircleTransparent]: CircleTransparentSrc,
    [ChatIcons.CircleFilled]: CircleFilledSrc,
    [ChatIcons.CircleLegacy]: CircleLegacySrc,
  };

  const rawSvgString = decodeURI(iconSources[icon].split('svg+xml,')[1]);

  const container = document.createElement('div');
  container.innerHTML = rawSvgString.trim();
  const svg = container.firstElementChild;

  if (svg) {
    Object.keys(style).forEach((key) => {
      (svg as any).style[key] = style[key];
    });
    return svg.outerHTML;
  }

  return;
};
