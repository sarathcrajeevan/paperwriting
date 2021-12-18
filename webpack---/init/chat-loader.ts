import {
  lazilyLoadFirebase,
  loadFirebase,
} from '../v1/services/bootstrap/firebase-loader';
import { loadingScheduler } from '../v1/services/loading-scheduler';

let interactivityTimerId;
const unpkgUrl = window.__UNPKG_URL__;

const FIREBASE_POLLING_MAX_DELAY = 5000;
const FIREBASE_POLLING_INTERVAL = 2500;

export const triggerInteractivity = () => {
  void loadFirebase(unpkgUrl).then(loadingScheduler.triggerInteractivity);

  window.removeEventListener('mouseover', triggerInteractivity);
  window.clearTimeout(interactivityTimerId);
};

export const loadChat = ({ chatToken }) => {
  if (chatToken) {
    void lazilyLoadFirebase(
      unpkgUrl,
      chatToken,
      FIREBASE_POLLING_MAX_DELAY,
      FIREBASE_POLLING_INTERVAL,
    ).then(triggerInteractivity);
  } else {
    void loadFirebase(unpkgUrl).then(triggerInteractivity);
  }

  window.addEventListener('mouseover', triggerInteractivity);
  interactivityTimerId = window.setTimeout(
    triggerInteractivity,
    FIREBASE_POLLING_MAX_DELAY,
  );
};
