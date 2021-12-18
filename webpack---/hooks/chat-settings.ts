import { ISendersData } from '@wix/chat-web';
import constate from 'constate';
import { useCallback, useState } from 'react';
import { hocify } from './utils';

export enum WidgetSenderIdentityType {
  ANONYMOUS = 'ANONYMOUS',
  AGENT = 'AGENT',
  BUSINESS = 'BUSINESS',
}

export interface SenderData {
  userId: string;
  name: string;
  image: string;
}

export interface ChatSettings {
  businessChatEnabled: boolean;
  socialChatEnabled: boolean;
  widgetSenderData: SenderData[];
  widgetSenderIdentity: WidgetSenderIdentityType;
}

interface Context {
  chatSettings: ChatSettings;
  updateChatSettings(propsToUpdate: Partial<ChatSettings>): void;
}

interface ProviderProps {
  chatSettings: ChatSettings;
}

export const transformSenderData = (serverData: SenderData[]): ISendersData =>
  serverData?.map((data) => ({
    id: data.userId,
    profileImage: data.image,
    userName: data.name,
  }));

const useContext = ({
  chatSettings: _chatSettings,
}: ProviderProps): Context => {
  const [chatSettings, setSettings] = useState<ChatSettings>(_chatSettings);

  const updateChatSettings = useCallback(
    (newSettings: Partial<ChatSettings>) =>
      setSettings((prevState) => ({
        ...prevState,
        ...newSettings,
      })),
    [chatSettings],
  );

  return {
    chatSettings,
    updateChatSettings,
  };
};

const useChatSettings_ = (context: Context) => {
  return context;
};

const useSenderIdentity_ = (context: Context) => {
  return context.chatSettings.widgetSenderIdentity;
};

const useSenderData_ = (context: Context) => {
  return context.chatSettings.widgetSenderData;
};

const useTransformedSendersData_ = (context: Context) => {
  return transformSenderData(context.chatSettings.widgetSenderData);
};

export const [
  ChatSettingsProvider,
  useChatSettings,
  useSenderData,
  useSenderIdentity,
  useTransformedSendersData,
] = constate(
  useContext,
  useChatSettings_,
  useSenderData_,
  useSenderIdentity_,
  useTransformedSendersData_,
);

export const withChatSettings = hocify(useChatSettings);
