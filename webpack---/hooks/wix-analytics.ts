import { useCallback } from 'react';
import { useServices } from './services-registry';
import { hocify } from './utils';

export interface WixAnalytics {
  trackCollapseEvent(): void;
  trackExpandEvent(): void;
  trackLeadEvent(): void;
}

export const useWixAnalytics = () => {
  const { hostSdk } = useServices();

  const trackExpandEvent = useCallback(() => {
    const eventName = 'Chat - Opened';
    hostSdk.trackEvent('CustomEvent', {
      event: eventName,
      eventAction: eventName,
      eventCategory: 'Engagement',
      eventLabel: 'Chat',
    });
  }, [hostSdk]);

  const trackCollapseEvent = useCallback(() => {
    const eventName = 'Chat - Closed';
    hostSdk.trackEvent('CustomEvent', {
      event: eventName,
      eventAction: eventName,
      eventCategory: 'Engagement',
      eventLabel: 'Chat',
    });
  }, [hostSdk]);

  const trackLeadEvent = useCallback(() => {
    hostSdk.trackEvent('Lead', {
      action: 'Chat - Lead capture form submitted',
      label: 'Chat',
    });
  }, [hostSdk]);

  return {
    trackExpandEvent,
    trackCollapseEvent,
    trackLeadEvent,
  };
};

export const withWixAnalytics = hocify(useWixAnalytics);
