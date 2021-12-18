import { useEffect, useState } from 'react';
import {
  ChatIcons,
  ChatThumbnailType,
  MinimizedChatLayouts,
} from '@wix/inbox-common';
import { useAppState } from './app-state';
import { useServices } from './services-registry';
import { useColors, useDesign, useEditorSettings } from './editor-settings';
import { useCollapseExpand } from './collapse-expand';
import { DeviceType } from '../types/host-sdk';
import { getIconRawElementString } from '../components/MinimizedChat/icons';

export const useQab = () => {
  const { appState } = useAppState();
  const { withQab } = appState;

  useRegisterQabClickHandler(withQab);
  useUpdateQabOnChanges(withQab);
  useForceLayoutToBeIcon();
};

const useRegisterQabClickHandler = (withQab: boolean) => {
  const { expand } = useCollapseExpand();
  const { hostSdk } = useServices();

  useEffect(() => {
    if (!withQab) {
      return;
    }
    const onQabClickListener = hostSdk.onQabClick(() =>
      expand('uou', 'widget'),
    );
    return () => {
      onQabClickListener();
    };
  }, [withQab]);
};

const useUpdateQabOnChanges = (withQab: boolean) => {
  const colors = useColors();
  const design = useDesign();
  const { isExpanded } = useCollapseExpand();
  const { hostSdk } = useServices();
  const {
    appState: { isVisible, unreadCount },
  } = useAppState();

  useEffect(() => {
    if (!withQab) {
      return;
    }

    hostSdk.updateQab({
      visible: !isExpanded && isVisible,
      notifications: (unreadCount || 0) > 0,
      color: colors.minimizedChatBackgroundColor.value,
      iconSvgContent: getIconSvgContent(
        design.chatThumbnailType,
        design.chatIcon,
        colors.minimizedChatTextColor.value,
      ),
    });
  }, [
    withQab,
    isExpanded,
    colors,
    design.chatThumbnailType,
    design.chatIcon,
    isVisible,
    unreadCount,
  ]);
};

const useForceLayoutToBeIcon = () => {
  const [isOverriden, setIsOverriden] = useState(false);
  const { appState } = useAppState();
  const { publicData, setPublicData } = useEditorSettings();
  const { isCollapsed, collapse } = useCollapseExpand();

  const isMobile = appState.deviceType === DeviceType.Mobile;

  useEffect(() => {
    if (
      isMobile &&
      (publicData.design.minimizedChatLayout !== MinimizedChatLayouts.Icon ||
        !publicData.design.displayChatIcon)
    ) {
      setPublicData({
        ...publicData,
        design: {
          ...publicData.design,
          minimizedChatLayout: MinimizedChatLayouts.Icon,
          displayChatIcon: true,
        },
      });
      setIsOverriden(true);
    }
  }, [isMobile, appState.withQab, publicData.design.minimizedChatLayout]);

  useEffect(() => {
    if (isOverriden && isCollapsed && !appState.withQab) {
      collapse();
    }
  }, [isOverriden, appState.withQab, collapse]);
};

export const getIconSvgContent = (
  chatThumbnailType: ChatThumbnailType,
  chatIcon: ChatIcons,
  color: string,
) => {
  if (chatThumbnailType !== ChatThumbnailType.Icon) {
    return getIconRawElementString(ChatIcons.CircleFilled, '24px', color);
  }
  return getIconRawElementString(chatIcon, '24px', color);
};
