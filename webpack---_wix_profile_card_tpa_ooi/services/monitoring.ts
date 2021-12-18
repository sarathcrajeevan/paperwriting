import { FlowAPI } from '../types/controller';
import { Interaction } from '../types';
import { HTTPError } from './error';

type LoggerOptions = { tags: { [id: string]: string } };

export interface MonitoringService {
  toMonitored: <T>(interaction: Interaction, promise: Promise<T>) => Promise<T>;
  log: (message: string, options?: LoggerOptions) => void;
}

const getErrorDetails = (error: HTTPError | Error) => {
  return 'errorDetails' in error ? error.errorDetails : null;
};

const captureException = (
  flowAPI: FlowAPI,
  interactionName: string,
  error: HTTPError | Error,
) => {
  const tags = { ...getErrorDetails(error), interactionName };
  return flowAPI.sentry.captureException(error, { tags });
};

const captureMessage = (
  flowAPI: FlowAPI,
  message: string,
  options?: LoggerOptions,
) => {
  const logOptions = { level: 'info' as const, ...options };
  return flowAPI.sentry.captureMessage(message, logOptions);
};

export const initMonitoringService = (flowAPI: FlowAPI): MonitoringService => ({
  toMonitored: async (interaction, promise) => {
    const fedopsLogger = flowAPI.fedops;

    try {
      fedopsLogger.interactionStarted(interaction);
      const response = await promise;
      fedopsLogger.interactionEnded(interaction);
      return response;
    } catch (error) {
      captureException(flowAPI, interaction, error);
      throw error;
    }
  },
  log: (message, options) => captureMessage(flowAPI, message, options),
});
