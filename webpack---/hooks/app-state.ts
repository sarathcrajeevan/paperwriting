import { IChatroom } from '@wix/chat-sdk';
import constate from 'constate';
import { useCallback, useMemo, useState } from 'react';
import { DeviceType, ViewMode } from '../types/host-sdk';
import { hocify } from './utils';

export enum AvailabilityStatus {
  Available = 'available',
  Away = 'away',
}

export interface AppState {
  coreChatToken?: string;
  businessChatroomId?: string;
  chatroomId?: string;
  instance?: string;
  instanceId?: string;
  visitorId?: string;
  visitorInstanceId?: string;
  shardId?: string;
  host: string;
  siteLanguage: string;
  correlationId?: string;
  deviceType: DeviceType;
  viewMode: ViewMode;
  availabilityStatus?: AvailabilityStatus;
  chatInstallationDate?: number;
  withQab: boolean;
  businessInfo: {
    name?: string;
    image?: string;
  };
  language: string;
  locale: string;
  isPrimaryLanguage: boolean;
  isBranded?: boolean;
  isLCFMandatory: boolean;
  isContact: boolean;
  unreadCount?: number;
  disableAutoMessages: boolean;
  hasMessages: boolean;
  wasAwayMessageSent: boolean;
  wasLCFSent: boolean;
  isVisible: boolean;
  showMessagePopup: boolean;
  messagePopupSenderName?: string;
  messagePopupLastUnreadMessage?: string;
  firebase?: {
    authKey: string;
    options: any;
    presencePath: string;
  };
  location?: string;
  timestamp?: string;
  isBot: boolean;
  editorSettingsLoaded: boolean;
  currentChatroom?: IChatroom;
  activeSocialMemberId?: string;
  activeSocialChatroomId?: string;
}

export interface InjectedAppStateProps {
  appState: AppState;
  updateAppState(propsToUpdate: Partial<AppState>): void;
  setAppState(newAppState: AppState): void;
}

interface ProviderProps {
  appState: AppState;
}

export const calculateAllowInput = ({
  availabilityStatus,
  isContact,
  isLCFMandatory,
}: Pick<AppState, 'availabilityStatus' | 'isContact' | 'isLCFMandatory'>) => {
  const isAvailable = availabilityStatus === AvailabilityStatus.Available;
  return isContact || (isAvailable && !isLCFMandatory);
};

const useValue = ({ appState }: ProviderProps) => appState;

const useAppState_ = (initialAppState: AppState) => {
  const [appState, setAppState] = useState<AppState>(initialAppState);

  const updateAppState = useCallback(
    (newAppState: Partial<AppState>) =>
      setAppState((prevState) => ({
        ...prevState,
        ...newAppState,
      })),
    [appState],
  );

  const allowInput = useMemo(() => {
    const { availabilityStatus, isContact, isLCFMandatory } = appState;
    return calculateAllowInput({
      availabilityStatus,
      isContact,
      isLCFMandatory,
    });
  }, [
    appState.isContact,
    appState.availabilityStatus,
    appState.isLCFMandatory,
  ]);

  return { appState, setAppState, updateAppState, allowInput };
};

export const [AppStateProvider, useAppState] = constate(useValue, useAppState_);

export const withAppState = hocify(useAppState);
