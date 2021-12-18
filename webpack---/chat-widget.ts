import { DataCapsule, FrameStorageStrategy } from 'data-capsule';
import { initI18nWithoutICU } from '@wix/wix-i18n-config';
import { create } from '@wix/fedops-logger';
import { EditorSettings } from '@wix/inbox-common';
import { WixHostSdk } from './services/wix-host-sdk';
import { AppState } from './hooks/app-state';
import { appStateFromChatInitResult } from './services/init-data';
import { DeviceType, ViewMode } from './types/host-sdk';
import { createWixBILogger } from './services/wix-bi-logger';
import { BI_EVENTS } from './services/widget-bi-logger';
import { init } from './init/init';
import { Environment } from './init/wrapper';
import { Duplexer } from '@wix/duplexer-js';
import { HttpClient } from '@wix/http-client';

const queryParams = new URLSearchParams(window.location.search);

const chatInitResult = window.__CHAT_INIT_RESULT__;
const siteLanguage = window.__SITE_LANGUAGE__;
const experiments = window.__EXPERIMENTS__;
const editorSettings: EditorSettings = window.__EDITOR_SETTINGS__;
const chatSettings = window.__CHAT_SETTINGS__;
const LCFSettings = window.__LCF_SETTINGS__;
const messages = window.__MESSAGES__;
const chatInstallationDate = window.__INSTALLATION_DATE__;
const businessInfo = window.__BUSINESS_INFO__;
const isBot = window.__IS_BOT__;

const hostSdk = new WixHostSdk(window.Wix, window.origin);

const userSelectedLanguage = queryParams.get('lang');
const language = userSelectedLanguage || siteLanguage;
const isPrimaryLanguage = queryParams.get('isPrimaryLanguage') !== 'false';
const locale =
  queryParams.get('dateNumberFormat') ||
  queryParams.get('locale') ||
  siteLanguage;
const instance = queryParams.get('instance') || '';
const disableAutoMessages = queryParams.has('disableDefaultMessages');
const host = decodeURIComponent(queryParams.get('host') || 'Wix');
const isEditorX = editorSettings.styleParams?.booleans?.responsive === true;

const chatInitAppState = chatInitResult
  ? appStateFromChatInitResult(chatInitResult)
  : {};
const shouldWaitForEditorSettings =
  hostSdk.getViewMode() !== ViewMode.Site &&
  hostSdk.getViewMode() !== ViewMode.Standalone;

const { isMandatory: isLCFMandatory, isContact } = LCFSettings || {};

const viewMode = hostSdk.getViewMode();

const appState: AppState = {
  language,
  locale,
  isPrimaryLanguage,
  siteLanguage,
  chatInstallationDate,
  instance,
  businessInfo: {
    name: businessInfo?.name,
    image: businessInfo?.image?.endsWith('/') ? undefined : businessInfo?.image,
  },
  instanceId: instance ? hostSdk.getInstanceId() : undefined,
  deviceType: hostSdk.getDeviceType(),
  viewMode,
  host,
  withQab:
    hostSdk.getDeviceType() === DeviceType.Mobile && !isEditorX ? true : false,
  ...chatInitAppState,
  isLCFMandatory,
  isContact,
  disableAutoMessages,
  hasMessages: false,
  wasAwayMessageSent: false,
  wasLCFSent: false,
  isVisible:
    hostSdk.getViewMode() === ViewMode.Standalone ||
    editorSettings.publicData.behaviour.pagesWithChat.includes('*'),
  showMessagePopup: false,
  isBot,
  editorSettingsLoaded: !shouldWaitForEditorSettings,
};

const httpClient = new HttpClient({
  getAppToken: () => appState.instance ?? '',
  multilingualOptions: {
    lang: language,
    locale,
    isPrimaryLanguage: appState.isPrimaryLanguage,
  },
  headers: {
    'X-Wix-Chat-Instance': appState.instance,
  },
});

const i18n = initI18nWithoutICU({
  locale: language,
  messages,
});

const biLogger = createWixBILogger(window.Wix, BI_EVENTS);

const compId = window.Wix.Utils.getCompId();
const dataCapsule = new DataCapsule({
  strategy: new FrameStorageStrategy(window.top, '*', compId, {
    connectionMaxTimeout: 7000,
  }),
  namespace: 'wix',
});

const instanceUpdater = {
  getInstance: () => appState.instance || '',
};

const duplexer = new Duplexer('duplexer.wix.com', {
  instanceUpdater,
});

// override specs.chat.WidgetRedesignPhase1 to solve https://wix.slack.com/archives/G01MU67L0KH/p1624195387000900
experiments['specs.chat.WidgetRedesignPhase1'] = 'true';

const chatToken = chatInitResult?.coreChatToken;

const environment: Environment = {
  fedopsLogger: create('chat-widget'),
  editorSettings,
  chatSettings,
  hostSdk,
  appState,
  experiments,
  httpClient,
  i18n,
  biLogger,
  dataCapsule,
  duplexer,
};

init(environment, chatToken);
