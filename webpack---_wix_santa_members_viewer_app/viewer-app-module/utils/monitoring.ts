const RAVEN_INIT_STRING = 'https://fe0974951f45411fbe57fbbd7c30bbf2@sentry.wixpress.com/28';
const FEDOPS_APP_NAME = 'santa-members-viewer-app';

interface FedopsInstance {
  interactionStarted: (name: string) => void;
  interactionEnded: (name: string) => void;
}

interface Raven {
  captureException: (err: string) => void;
  captureMessage: (message: string, options: any) => void;
  setUserContext: (context: { msid: string }) => void;
}

let raven: Raven;
let fedopsInstance: FedopsInstance;

export const initializeMonitoring = (initParams: any, platformServices: any) => {
  raven = platformServices.monitoring.createMonitor(RAVEN_INIT_STRING);

  if (raven) {
    raven.setUserContext({ msid: platformServices.bi.metaSiteId });
  }

  fedopsInstance = platformServices.fedOpsLoggerFactory.getLoggerForWidget({
    appName: FEDOPS_APP_NAME,
    appId: initParams.appDefinitionId,
  });
};

function interactionStarted(interactionName: string) {
  try {
    fedopsInstance.interactionStarted(interactionName);
  } catch (e) {
    const err = 'Failed to start fedops interaction, reason: ' + e;
    if (raven) {
      raven.captureException(err);
    }
  }
}

function interactionEnded(interactionName: string) {
  try {
    fedopsInstance.interactionEnded(interactionName);
  } catch (e) {
    const err = 'Failed to end fedops interaction, reason: ' + e;
    if (raven) {
      raven.captureException(err);
    }
  }
}

export const toMonitored = (interactionName: string, fn: () => any) => () => {
  try {
    interactionStarted(interactionName);
    const response = fn();
    interactionEnded(interactionName);
    return response;
  } catch (e) {
    console.error(e);
    if (raven) {
      raven.captureException(e);
    }
    throw e;
  }
};

export function log(message: string, options = {}) {
  if (raven?.captureMessage) {
    raven.captureMessage(message, { level: 'info', ...options });
  }
}

export function logError(message: string, options = {}) {
  if (raven?.captureMessage) {
    raven.captureMessage(message, { level: 'error', ...options });
  }
}
