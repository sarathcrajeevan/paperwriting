import { Config } from '../common/types';

export interface WixExperiments {
  enabled: (name: string) => boolean;
  ready: () => Promise<void>;
}

export const initExperiments = async (config: Config) => {
  try {
    const createExperiments = config?.essentials?.createExperiments;
    const createExperimentsOptions = { scopes: ['members-area'] };
    const experiments = createExperiments?.(createExperimentsOptions) ?? null;

    if (experiments) {
      await experiments.ready();
    }

    return experiments;
  } catch {
    return null;
  }
};
