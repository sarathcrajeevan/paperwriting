import constate from 'constate';
import { useCallback, useLayoutEffect, useState } from 'react';
import { getResizer } from '../services/resizer';
import { useServices } from './services-registry';
import { useDesign } from './editor-settings';
import { useAppState } from './app-state';
import { DeviceType, ViewMode } from '../types/host-sdk';
import { getDimensions } from '../services/dimensions';
import { useWixAnalytics } from './wix-analytics';
import { useCorvidApi } from './corvid-api';

interface ProviderProps {
  initialValue?: boolean;
}

interface Context {
  isExpanded: boolean;
  setIsExpanded(boolean): void;
}

interface CollapseExpand {
  isExpanded: boolean;
  isCollapsed: boolean;
  collapse(withPopup?: boolean): void;
  expand(direction?: string, triggerBy?: string): void;
  toggle(direction?: string, triggerBy?: string): void;
  setRef(ref: HTMLElement): void;
}

const useContext = ({ initialValue = false }: ProviderProps): Context => {
  const [isExpanded, setIsExpanded] = useState(initialValue);
  return { isExpanded, setIsExpanded };
};

const useCollapseExpand_ = (context: Context): CollapseExpand => {
  const [ref, setRef] = useState<HTMLElement | undefined>(undefined);
  const { hostSdk, biLogger } = useServices();
  const design = useDesign();
  const { appState } = useAppState();
  const { trackExpandEvent, trackCollapseEvent } = useWixAnalytics();
  const corvidApi = useCorvidApi();

  const { withQab } = appState;
  const isMobile = appState.deviceType === DeviceType.Mobile;
  const isCollapsed = !context.isExpanded;

  const collapse = useCallback(async () => {
    const dimensions = getDimensions(design, isMobile);
    const resizer = getResizer(withQab, isMobile, hostSdk, dimensions);
    await resizer.collapse(appState.showMessagePopup);

    if (context.isExpanded) {
      trackCollapseEvent();
      corvidApi.reportWidgetCollapsed();
    }

    context.setIsExpanded(false);
  }, [context, corvidApi, trackCollapseEvent, appState.showMessagePopup]);

  const expand = useCallback(
    async (direction?: string, triggerBy?: string) => {
      const dimensions = getDimensions(design, isMobile);
      const resizer = getResizer(withQab, isMobile, hostSdk, dimensions);
      await resizer.expand();

      if (!context.isExpanded) {
        trackExpandEvent();
        corvidApi.reportWidgetExpand();

        if (direction && triggerBy) {
          biLogger.expandChatEvent({
            direction,
            triggerBy,
            host: appState.host,
          });
        }
      }

      context.setIsExpanded(true);
    },
    [context, corvidApi, trackExpandEvent, appState.host],
  );

  const toggle = useCallback(
    (direction?: string, triggerBy?: string) => {
      context.isExpanded ? collapse() : expand(direction, triggerBy);
    },
    [context.isExpanded, collapse, expand],
  );

  useLayoutEffect(() => {
    const resizeHost = () => {
      const dimensions = ref?.getBoundingClientRect();
      const adjustDimensions = getDimensions(design, isMobile, dimensions);
      const resizer = getResizer(withQab, isMobile, hostSdk, adjustDimensions);

      if (isCollapsed) {
        void resizer.collapse(appState.showMessagePopup);
      } else {
        void resizer.expand();
      }
    };

    const observer = new MutationObserver(resizeHost);

    if (ref) {
      observer.observe(ref, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true,
      });
    }

    resizeHost();

    return () => observer.disconnect();
  }, [
    ref,
    isCollapsed,
    withQab,
    isMobile,
    hostSdk,
    design,
    appState.showMessagePopup,
  ]);

  return {
    isExpanded: context.isExpanded,
    isCollapsed,
    collapse,
    expand,
    toggle,
    setRef,
  };
};

export const [CollapseExpandProvider, useCollapseExpand] = constate(
  useContext,
  useCollapseExpand_,
);
