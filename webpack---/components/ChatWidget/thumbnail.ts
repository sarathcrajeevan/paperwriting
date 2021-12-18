import {
  ChatIcons,
  ChatThumbnailType,
  MinimizedChatLayouts,
  PublicDataDesign,
} from '@wix/inbox-common';

export const getThumbnail = (
  design: PublicDataDesign,
  businessLogo: string | undefined,
  isExpanded: boolean,
  isMembersChat: boolean,
  imageUrlResolver: (
    relativeUrl: string,
    width: number,
    height: number,
  ) => string,
) => {
  const iconLayout = design.minimizedChatLayout === MinimizedChatLayouts.Icon;

  if (iconLayout) {
    if (isExpanded) {
      return ChatIcons.Close;
    }

    if (design.chatThumbnailType === ChatThumbnailType.LegacyIcon) {
      return ChatIcons.CircleFilled; // default
    }
  }

  if (!design.displayChatIcon) {
    return;
  }

  if (isMembersChat && !iconLayout) {
    return;
  }

  if (design.chatThumbnailType === ChatThumbnailType.URL) {
    const customImage = design.customImg && design.customImg[0]?.relativeUri;
    if (customImage) {
      const dimensions = iconLayout ? 68 : 32;
      return imageUrlResolver(customImage, dimensions, dimensions);
    }
    return businessLogo ?? 'default-logo';
  }

  return design.chatIcon;
};
