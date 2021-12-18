import React, { FC } from 'react';
import { Constants, Message } from '@wix/chat-sdk';
import { MessageEntry } from '@wix/chat-web';
import {
  WidgetSenderIdentityType,
  useSenderIdentity,
} from '../../hooks/chat-settings';
import { useAppState } from '../../hooks/app-state';
import { withLockedTranslation } from '../../hooks/utils';

export interface TitleBubbleProps {
  message: Message;
  title?: string;
}

const TitleBubble: FC<TitleBubbleProps> = ({ message, title }) => {
  const { appState } = useAppState();
  const senderIdentity = useSenderIdentity();

  const isSenderIdentityIncludeTitle =
    senderIdentity === WidgetSenderIdentityType.BUSINESS ||
    senderIdentity === WidgetSenderIdentityType.AGENT;

  const showTitle =
    isSenderIdentityIncludeTitle &&
    (message?.groupPosition === Constants.MessagePositionInGroup.SINGLE ||
      message?.groupPosition === Constants.MessagePositionInGroup.START);

  if (!showTitle) {
    return <div />;
  }

  const titleToPresent = title ?? appState.messagePopupSenderName;

  return (
    <div>
      <MessageEntry
        title={titleToPresent}
        separateTitle={true}
        groupPosition={message.groupPosition}
        position={Constants.MessageDirections.Incoming}
      />
    </div>
  );
};

export default withLockedTranslation(TitleBubble);
