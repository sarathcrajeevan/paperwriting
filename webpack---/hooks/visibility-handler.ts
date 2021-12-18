import { useCallback, useEffect, useState } from 'react';
import { useAppState } from './app-state';
import { useCollapseExpand } from './collapse-expand';
import { useBehaviour } from './editor-settings';
import { useServices } from './services-registry';
import { ViewMode } from '../types/host-sdk';

export const useVisibilityHandler = () => {
  const { hostSdk } = useServices();
  const { collapse } = useCollapseExpand();
  const { pagesWithChat } = useBehaviour();
  const {
    appState: { hasMessages, isVisible },
    updateAppState,
  } = useAppState();

  const visibilityHandler = useCallback(async () => {
    const currentPageId = await hostSdk.getCurrentPageId();
    const shouldShowOnPage =
      hostSdk.getViewMode() === ViewMode.Standalone ||
      pagesWithChat.includes(currentPageId) ||
      pagesWithChat.includes('*') ||
      hasMessages;
    const changeRequired = shouldShowOnPage !== isVisible;

    if (changeRequired) {
      if (shouldShowOnPage) {
        collapse();
        updateAppState({ isVisible: true });
      } else {
        collapse();
        updateAppState({ isVisible: false });
        void hostSdk.resizeTo(0, 0);
      }
    }
  }, [hostSdk.getCurrentPageId, isVisible, collapse, hasMessages]);

  useEffect(() => {
    return hostSdk.subscribeToPageNavigation(visibilityHandler);
  }, [hostSdk.getCurrentPageId, isVisible, collapse, hasMessages]);

  useEffect(() => {
    void visibilityHandler();
  }, [hasMessages]);
};
