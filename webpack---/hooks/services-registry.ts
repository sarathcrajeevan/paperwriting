import constate from 'constate';
import { FedopsLogger } from '@wix/fedops-logger';
import { ServerApi } from '../services/server-api';
import { HostSdk } from '../types/host-sdk';
import { Experiments } from '../services/experiments';
import { hocify } from './utils';
import { WidgetBILogger } from '../services/widget-bi-logger';
import { VisitCounter } from '../services/visit-counter';
import { HttpClient } from '@wix/http-client';
import { BILogger } from '../types/bi-logger';
import { Duplexer } from '@wix/duplexer-js';

export interface Services {
  hostSdk: HostSdk;
  fedopsLogger: FedopsLogger;
  serverApi: ServerApi;
  experiments: Experiments;
  biLogger: WidgetBILogger;
  visitCounter: VisitCounter;
  httpClient: HttpClient;
  internalBiLogger: BILogger;
  duplexer: Duplexer;
}

interface ProviderProps {
  services: Services;
}

const useValue = ({ services }: ProviderProps) => services;

const useServices_ = (services: Services) => services;

export const [ServicesProvider, useServices] = constate(useValue, useServices_);

export const withServices = hocify(useServices);
