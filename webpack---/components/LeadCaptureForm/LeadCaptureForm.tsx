import React, { FC, useEffect } from 'react';
import styles from './LeadCaptureForm.scss';
import { MessageEntry } from '@wix/chat-web';
import { Constants, Message } from '@wix/chat-sdk';
import ThankYouScreen from './ThankYouScreen';
import Form from './Form';
import * as Sentry from '@sentry/browser';
import TitleBubble from '../TitleBubble/TitleBubble';
import classNames from 'classnames';
import { useAppState } from '../../hooks/app-state';
import { useTheme } from '../../hooks/theme';
import {
  WidgetSenderIdentityType,
  useSenderIdentity,
} from '../../hooks/chat-settings';
import { ViewMode } from '../../types/host-sdk';
import { useWixAnalytics } from '../../hooks/wix-analytics';
import { withLockedTranslation } from '../../hooks/utils';

const MessagePositionInGroup = Constants.MessagePositionInGroup;

interface LeadCaptureFormProps {
  groupPosition: string;
  introText?: string;
  fields: string;
  thankYouMessage: string;
  message: Message;
}

const LeadCaptureForm: FC<LeadCaptureFormProps> = ({
  message,
  introText,
  groupPosition,
  fields,
  thankYouMessage,
}) => {
  const senderIdentity = useSenderIdentity();
  const { trackLeadEvent } = useWixAnalytics();
  const { appState, updateAppState } = useAppState();
  const { chatWeb: theme } = useTheme();
  const narrowStyle = senderIdentity !== WidgetSenderIdentityType.ANONYMOUS;

  const getGroupPositionForIntro = (outerPosition) => {
    switch (outerPosition) {
      case MessagePositionInGroup.SINGLE: {
        return MessagePositionInGroup.START;
      }
      case MessagePositionInGroup.END: {
        return MessagePositionInGroup.MIDDLE;
      }
      default: {
        return outerPosition;
      }
    }
  };

  const getGroupPositionForForm = (outerPosition, hasIntroBefore) => {
    if (!hasIntroBefore) {
      return outerPosition;
    }

    switch (outerPosition) {
      case MessagePositionInGroup.SINGLE: {
        return MessagePositionInGroup.END;
      }
      case MessagePositionInGroup.START: {
        return MessagePositionInGroup.MIDDLE;
      }
      default: {
        return outerPosition;
      }
    }
  };

  const getTitle = () => {
    const isSenderIdentityIncludeTitle =
      senderIdentity === WidgetSenderIdentityType.BUSINESS ||
      senderIdentity === WidgetSenderIdentityType.AGENT;
    const isGroupPositionIncludeTitle =
      message?.groupPosition === Constants.MessagePositionInGroup.SINGLE ||
      message?.groupPosition === Constants.MessagePositionInGroup.START;
    const isTitleShouldBeDisplay =
      isSenderIdentityIncludeTitle && isGroupPositionIncludeTitle;

    return isTitleShouldBeDisplay ? appState.messagePopupSenderName : undefined;
  };

  const getIntroText = () => {
    return (
      introText && (
        <div className={styles.entry} data-hook={'lcf-intro-message'}>
          <MessageEntry
            groupPosition={getGroupPositionForIntro(groupPosition)}
            position={Constants.MessageDirections.Incoming}
            title={getTitle()}
            separateTitle={false}
          >
            <div className={classNames(styles.introText)}>{introText}</div>
          </MessageEntry>
        </div>
      )
    );
  };

  const handleSubmit = () => {
    updateAppState({ wasLCFSent: true, isContact: true });
    trackLeadEvent();
  };

  const formGroupPosition = getGroupPositionForForm(groupPosition, !!introText);
  const fieldsParsed = JSON.parse(fields);
  const { background, textColor } = theme?.room?.button || {};
  const inputBackground = theme?.room?.message?.incomingBackground;
  const inputTextColor = theme?.room?.message?.incomingTextColor;
  const borderRadius = theme?.room?.button?.borderRadius || '20';
  const showThankYouMessage =
    appState.wasLCFSent ||
    (appState.isContact && appState.viewMode === ViewMode.Site);

  return (
    <div
      className={styles.leadCaptureForm}
      data-hook="lead-capture-form"
      style={{ fontFamily: theme.room.fontFamily }}
    >
      {getIntroText()}
      {showThankYouMessage ? (
        <ThankYouScreen
          thankYouMessage={thankYouMessage}
          groupPosition={formGroupPosition}
          narrowStyle={narrowStyle}
          title={getTitle()}
        />
      ) : (
        <div>
          {!introText && <TitleBubble message={message} />}
          <Form
            key={fields}
            fields={fieldsParsed}
            groupPosition={formGroupPosition}
            onSubmit={handleSubmit}
            buttonBackgroundColor={background}
            buttonTextColor={textColor}
            inputBackground={inputBackground}
            inputTextColor={inputTextColor}
            borderRadius={parseInt(borderRadius, 10)}
            isActive={appState.viewMode !== ViewMode.Editor}
            narrowStyle={narrowStyle}
          />
        </div>
      )}
    </div>
  );
};

export default withLockedTranslation(LeadCaptureForm);
