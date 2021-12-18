import { useEffect } from 'react';
import { useAppState } from './app-state';
import { useServices } from './services-registry';
import { useSubscribeToPageNavigation } from './page-navigation';
import { ViewMode } from '../types/host-sdk';

export const useVisitorOnPageReporter = () => {
  const { serverApi, hostSdk, experiments } = useServices();
  const { appState } = useAppState();
  const { pageId, pageTitle } = useSubscribeToPageNavigation();
  const { visitorId, viewMode } = appState;

  useEffect(() => {
    if (visitorId && pageId && pageTitle && viewMode !== ViewMode.Editor) {
      serverApi.reportVisitorOnPageEvent(
        pageId,
        visitorId,
        hostSdk.getAid(),
        pageTitle,
      );
    }
  }, [pageId, pageTitle, visitorId, hostSdk, viewMode]);
};
