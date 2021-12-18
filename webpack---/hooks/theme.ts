import { MinimizedChatLayouts, SitePalette } from '@wix/inbox-common';
import { useEffect, useState } from 'react';
import {
  useDesign,
  useColors,
  useFonts,
  useTextPresets,
  useSiteColors,
} from './editor-settings';
import { generateBackgroundPatternObject } from '../services/pattern';
import { useAppState } from './app-state';
import { useServices } from './services-registry';
import { getImageComponent } from '../components/MinimizedChat/icons';
import { hocify } from './utils';
import { fallbackFont } from '../constants';
import { getRgbA } from '../services/colors';

interface Pattern {
  asset: string;
  backgroundSize: string;
}

export interface Theme {
  widget: {
    borderColor: string;
    borderWidth: number;
    borderRadius: string;
    borderStyle: string;
  };
  header: {
    backgroundColor: string;
    textColor: string;
    font: string;
    imageUrl?: string;
    imageSvg?: any;
  };
  messageNotification: {
    backgroundColor: string;
    fontFamily: string;
    textColor: string;
    borderRadius: string;
    borderWidth: number;
    borderStyle: string;
    borderColor: string;
    callToActionColor: string;
  };
  chatWeb: {
    input: {
      dividerColor: string;
      dividerWidth: number;
      color: string;
      sendIconColor: string;
    };
    room: {
      button: {
        background: string;
        borderRadius: string;
        textColor: string;
      };
      padding: string;
      pattern: Pattern;
      background: string;
      fontFamily: string;
      marginBetweenMessages: number;
      marginBetweenGroupMessages: number;
      dropzone: {
        backgroundColor: string;
        opacity: number;
        color: string;
        dropLogoSize: number;
      };
      message: {
        enlargeSingleEmojis: boolean;
        minWidth: number;
        maxWidth: number;
        padding: string;
        title: {
          look: string;
          useMessageColors?: boolean;
          inheritFont: boolean;
        };
        borderRadius: number;
        outgoingBackground: string;
        outgoingTextColor: string;
        incomingBackground: string;
        incomingTextColor: string;
        status: {
          useMessageColors?: boolean;
          look: string;
          inheritFont: boolean;
        };
      };
      template: {
        inheritFont: boolean;
        backgroundColor?: string;
        width?: string;
        imageHeight: string;
      };
      image: {
        look: string;
      };
      typingIndication: {
        look?: string;
      };
      unreadAnchor: {
        look: string;
        hideStroke: boolean;
      };
      unreadMessagesButton: {
        look: string;
        hideArrow: boolean;
      };
      timestamp: {
        look: string;
        hideStroke: boolean;
      };
    };
  };
  social: {
    textColor: string;
    font: string;
    button: {
      backgroundColor: string;
      color: string;
      borderRadius: string;
    };
    searchBox: {
      borderRadius: string;
      backgroundColor: string;
      color: string;
    };
  };
}

export const useTheme = (): Theme => {
  const [pattern, setPattern] = useState<Pattern>({
    asset: '',
    backgroundSize: '',
  });
  const { appState } = useAppState();
  const design = useDesign();
  const colors = useColors();
  const fonts = useFonts();
  const textPresets = useTextPresets();
  const { hostSdk } = useServices();
  const siteColors = useSiteColors();

  const sitePallete = new SitePalette(siteColors, textPresets);

  const borderRadiusPx = `${design.selectedRadiusOption}px`;
  const borderRadiusOnlyTop = `${borderRadiusPx} ${borderRadiusPx} 0 0`;
  const chatPinToButton =
    design.minimizedChatLayout === MinimizedChatLayouts.Fixed;

  const getBusinessLogo = () => {
    const customImage = design.customImg && design.customImg[0]?.relativeUri;
    if (customImage) {
      return hostSdk.getResizedImgUrl(customImage, 48, 48);
    }
    return appState.businessInfo?.image;
  };

  const getBusinessLogoFallbacks = () => {
    return getImageComponent('default-logo', '48', '50%');
  };

  const headerImageUrl = design.headerDisplayLogo
    ? getBusinessLogo()
    : undefined;

  const backgroundColor =
    design.backgroundColor?.value ?? colors.backgroundColor.value;

  useEffect(() => {
    void (async () => {
      const backgroundPattern = await generateBackgroundPatternObject(
        design.selectedBackgroundPattern,
        design.selectedBackgroundPatternOpacity,
        backgroundColor,
      );
      setPattern(backgroundPattern);
    })();
  }, [
    design.selectedBackgroundPattern,
    design.selectedBackgroundPatternOpacity,
    backgroundColor,
  ]);

  const roomButtonTextColor = (): string => {
    // TODO remove this after color-layering is not done using linear-gradient
    const colorFromSettings = colors.yourMessageBackgroundColor?.value;
    if (!colorFromSettings.includes('linear-gradient')) {
      return colorFromSettings;
    }
    return sitePallete.resolveColor(
      colors.yourMessageBackgroundColor?.themeName,
    );
  };

  return {
    widget: {
      borderColor: colors.borderColor?.value,
      borderWidth: design?.selectedBorderWidth,
      borderRadius: chatPinToButton ? borderRadiusOnlyTop : borderRadiusPx,
      borderStyle: chatPinToButton ? 'solid solid none solid' : 'solid',
    },
    header: {
      backgroundColor: colors.headerBackgroundColor?.value,
      textColor: colors.headerFontColor?.value,
      font: [fonts.header, fallbackFont].join(', '),
      imageUrl: design.headerDisplayLogo ? headerImageUrl : undefined,
      imageSvg:
        design.headerDisplayLogo && !headerImageUrl
          ? getBusinessLogoFallbacks()
          : undefined,
    },
    messageNotification: {
      backgroundColor: '#ffffff',
      fontFamily: [fonts.messages, fallbackFont].join(', '),
      textColor: '#000000',
      borderRadius: `${design.selectedRadiusOption}px`,
      borderWidth: design?.selectedBorderWidth,
      borderStyle: chatPinToButton ? 'solid solid none solid' : 'solid',
      borderColor: colors.borderColor?.value,
      callToActionColor: colors.sendIconColor.value,
    },
    chatWeb: {
      input: {
        dividerColor: '#eeeeee',
        dividerWidth: 1,
        color: '#000000',
        sendIconColor: colors.sendIconColor?.value,
      },
      room: {
        dropzone: {
          dropLogoSize: 36,
          opacity: 0.9,
          color: colors.headerFontColor?.value,
          backgroundColor: colors.headerBackgroundColor?.value,
        },
        button: {
          /* invert of incoming message colors */
          background: colors.yourMessageFontColor?.value,
          borderRadius: design.selectedRadiusOption,
          textColor: roomButtonTextColor(),
        },
        padding: `0px 20px 20px 20px`,
        pattern,
        background: backgroundColor,
        fontFamily: [fonts.messages, fallbackFont].join(', '),
        marginBetweenMessages: 16,
        marginBetweenGroupMessages: 4,
        typingIndication: {
          look: 'system-look-1',
        },
        message: {
          enlargeSingleEmojis: true,
          padding: '12px 16px',
          title: {
            look: 'system-look-1',
            useMessageColors: true,
            inheritFont: false,
          },
          minWidth: 50,
          maxWidth: 220,
          borderRadius: Math.min(parseInt(design.selectedRadiusOption, 10), 20),
          outgoingBackground: colors.otherMessageBackgroundColor?.value,
          outgoingTextColor: colors.otherMessageFontColor?.value,
          incomingBackground: colors.yourMessageBackgroundColor?.value,
          incomingTextColor: colors.yourMessageFontColor?.value,
          status: {
            useMessageColors: false,
            look: 'system-look-1',
            inheritFont: false,
          },
        },
        template: {
          inheritFont: false,
          backgroundColor: colors.yourMessageBackgroundColor?.value,
          width: '200px',
          imageHeight: '180px',
        },
        image: {
          look: 'system-look-1',
        },
        unreadAnchor: {
          look: 'system-look-1',
          hideStroke: true,
        },
        unreadMessagesButton: {
          look: 'system-look-1',
          hideArrow: true,
        },
        timestamp: {
          look: 'system-look-1',
          hideStroke: true,
        },
      },
    },
    social: {
      textColor: colors.headerFontColor?.value,
      font: fonts.messages,
      button: {
        color: '#ffffff',
        backgroundColor: colors.sendIconColor?.value,
        borderRadius: borderRadiusPx,
      },
      searchBox: {
        borderRadius: borderRadiusPx,
        backgroundColor: getRgbA(colors.yourMessageFontColor?.value, 0.07),
        color: colors.yourMessageFontColor?.value,
      },
    },
  };
};

export const withTheme = hocify(useTheme);
