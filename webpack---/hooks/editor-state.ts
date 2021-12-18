import { useState } from 'react';
import { Message } from '@wix/chat-sdk';
import constate from 'constate';

interface ProviderProps {
  initialValue?: Message[];
}

interface Context {
  messagesList: Message[];
  setMessagesList(messageList: Message[]): void;
  showMessagePopup: boolean;
  setShowMessagePopup(shouldShow: boolean): void;
  showSendButton: boolean;
  setShowSendButton(shouldForce: boolean): void;
  showSocialList: boolean;
  setShowSocialList(shouldForce: boolean): void;
  chatrooms: any[];
  setChatrooms(chatrooms: any[]): void;
}

const useContext = (): Context => {
  const [messagesList, setMessagesList] = useState<Message[]>([]);
  const [showMessagePopup, setShowMessagePopup] = useState(false);
  const [showSendButton, setShowSendButton] = useState(false);
  const [showSocialList, setShowSocialList] = useState(false);
  const [chatrooms, setChatrooms] = useState<any[]>([]);

  return {
    messagesList,
    setMessagesList,
    showMessagePopup,
    setShowMessagePopup,
    showSendButton,
    setShowSendButton,
    showSocialList,
    setShowSocialList,
    chatrooms,
    setChatrooms,
  };
};

export const [EditorStateProvider, useEditorState] = constate(
  useContext,
  useContext,
);
