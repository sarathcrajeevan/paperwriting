import React, { Suspense } from 'react';
import { FedopsLogger } from '@wix/fedops-logger';
import { HttpClient } from '@wix/http-client';
import { EditorSettings } from '@wix/inbox-common';
import { I18nextProvider, i18n } from '@wix/wix-i18n-config';
import { DataCapsule } from 'data-capsule';
import { Duplexer } from '@wix/duplexer-js';
import { WixStyleReactProvider } from 'wix-style-react';
import { EditorSettingsProvider } from '../hooks/editor-settings';
import { ChatSettingsProvider, ChatSettings } from '../hooks/chat-settings';
import { CollapseExpandProvider } from '../hooks/collapse-expand';
import { AppState, AppStateProvider } from '../hooks/app-state';
import { Services, ServicesProvider } from '../hooks/services-registry';
import { ServerApi } from '../services/server-api';
import { HostSdk } from '../types/host-sdk';
import { Experiments } from '../services/experiments';
import { WidgetBILogger } from '../services/widget-bi-logger';
import { BILogger } from '../types/bi-logger';
import { EditorStateProvider } from '../hooks/editor-state';
import { VisitCounter } from '../services/visit-counter';

export interface Environment {
  fedopsLogger: FedopsLogger;
  editorSettings: EditorSettings;
  chatSettings: ChatSettings;
  hostSdk: HostSdk;
  appState: AppState;
  experiments: Record<string, string>;
  httpClient: HttpClient;
  i18n: i18n;
  biLogger: BILogger;
  dataCapsule: DataCapsule;
  duplexer: Duplexer;
}

export const wrapWithEnvironment =
  (environment: Environment) => (component: React.ReactElement) => {
    const services: Services = {
      hostSdk: environment.hostSdk,
      fedopsLogger: environment.fedopsLogger,
      serverApi: new ServerApi(environment.httpClient),
      experiments: new Experiments(environment.experiments),
      biLogger: new WidgetBILogger(environment.biLogger, environment.hostSdk),
      visitCounter: new VisitCounter(
        environment.dataCapsule,
        environment.hostSdk.getInstanceId(),
      ),
      httpClient: environment.httpClient,
      internalBiLogger: environment.biLogger,
      duplexer: environment.duplexer,
    };

    return (
      <WixStyleReactProvider
        features={{ reducedSpacingAndImprovedLayout: true }}
        as="div"
      >
        <I18nextProvider i18n={environment.i18n}>
          <AppStateProvider appState={environment.appState}>
            <ServicesProvider services={services}>
              <EditorSettingsProvider
                editorSettings={environment.editorSettings}
              >
                <EditorStateProvider>
                  <ChatSettingsProvider chatSettings={environment.chatSettings}>
                    <CollapseExpandProvider>
                      <Suspense fallback={null}>{component}</Suspense>
                    </CollapseExpandProvider>
                  </ChatSettingsProvider>
                </EditorStateProvider>
              </EditorSettingsProvider>
            </ServicesProvider>
          </AppStateProvider>
        </I18nextProvider>
      </WixStyleReactProvider>
    );
  };
