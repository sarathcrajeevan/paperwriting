import React, { useEffect, useRef, useContext } from 'react';

export enum FlowElements {
  TIME_PICKER = 'TIME_PICKER',
  SIDEBAR = 'SIDEBAR',
  BOTTOM_SECTION = 'BOTTOM_SECTION',
}

export const CalendarFlowContext = React.createContext<
  FlowElements | undefined
>(undefined);
export const CalendarFlowProvider = CalendarFlowContext.Provider;

export function useFlow(flowElement: FlowElements) {
  const elementInFocus = useContext(CalendarFlowContext);
  const elementRef = useRef(null) as React.MutableRefObject<any>;

  const getScrollAmount = () => {
    const rect = elementRef?.current?.getBoundingClientRect?.();
    if (rect) {
      const screenViewPort = {
        top: window.pageYOffset,
        bottom: window.pageYOffset + window.innerHeight,
      };
      const elementViewPort = {
        top: window.pageYOffset + rect.top,
        bottom: window.pageYOffset + rect.bottom,
      };
      const isElementInView =
        elementViewPort.top > screenViewPort.top &&
        elementViewPort.bottom < screenViewPort.bottom;
      if (!isElementInView) {
        const yOffset = -40;
        return elementViewPort.top - screenViewPort.top + yOffset;
      }
    }
    return 0;
  };

  const scrollIntoView = () => {
    const scrollAmount = getScrollAmount();
    if (scrollAmount !== 0) {
      const y = window.pageYOffset + scrollAmount;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (elementInFocus === flowElement) {
      scrollIntoView();
    }
  }, [elementInFocus]);

  return elementRef;
}
