import { FormState } from '../state/initialStateFactory';
import {
  FormEvents,
  PaymentMethod,
  ReservedPaymentOptionIds,
  SettingsSubTab,
  SettingsTab,
} from '../../types/types';

function mapFormEventToState({
  event,
  payload,
}: {
  event: FormEvents;
  payload: any;
}): Partial<FormState> {
  switch (event) {
    case FormEvents.SETTINGS_TAB_CHANGED:
      return {
        editorContext: {
          isDummy: true,
          selectedSettingsTabId: payload.value as SettingsTab,
        },
      };
    case FormEvents.SETTINGS_SUB_TAB_SELECTED:
      return {
        editorContext: {
          isDummy: true,
          selectedSettingsSubTabId: payload.value as SettingsSubTab,
        },
      };
  }
  return {};
}

export function mapConfigToState(config: any): Partial<FormState> {
  const defaultPaymentMethod = config.publicData.COMPONENT.defaultPaymentMethod;
  const settingsEvent = config.publicData.COMPONENT.___settingsEvent;

  return {
    ...(defaultPaymentMethod
      ? {
          selectedPaymentOptionId:
            defaultPaymentMethod === PaymentMethod.SINGLE
              ? ReservedPaymentOptionIds.SingleSession
              : ReservedPaymentOptionIds.BuyAPricingPlan,
        }
      : {}),
    ...(settingsEvent ? mapFormEventToState(settingsEvent) : {}),
  };
}
