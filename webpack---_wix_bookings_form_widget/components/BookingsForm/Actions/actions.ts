import {
  CalculatePaymentDetails,
  createCalculatePaymentDetailsAction,
} from './calculatePaymentDetails/calculatePaymentDetails';
import {
  createSetNumberOfParticipantsAction,
  SetNumberOfParticipants,
} from './setNumberOfParticipants/setNumberOfParticipants';
import { FormState } from '../../../utils/state/initialStateFactory';
import { FormContext } from '../../../utils/context/contextFactory';
import { ActionFactoryParams } from '../../../utils/ControlledComponent/ControlledComponent.types';
import { createOnSubmitAction, OnSubmit } from './onSubmit/onSubmit';
import {
  createSetPaymentOptionAction,
  SetPaymentOption,
} from './setPaymentOption/setPaymentOption';
import {
  createSetSelectedPaymentTypeAction,
  setSelectedPaymentType,
} from './setSelectedPaymentType/setSelectedPaymentType';
import {
  createPromptLoginAction,
  PromptLogin,
} from './promptLogin/promptLogin';
import { createSetCouponAction, SetCoupon } from './setCoupon/setCoupon';
import {
  createRemoveCouponAction,
  RemoveCoupon,
} from './removeCoupon/removeCoupon';
import {
  createOnToggleCouponAction,
  OnToggleCoupon,
} from './onToggleCoupon/onToggleCoupon';
import { createOnLoginAction, OnLogin } from './onLogin/onLogin';
import {
  OnToastClose,
  createOnToastCloseAction,
} from './onToastClose/onToastClose';
import {
  OnDialogClose,
  createOnDialogCloseAction,
} from './onDialogClose/onDialogClose';
import {
  createInitializeWidgetAction,
  InitializeWidget,
} from './initializeWidget/initializeWidget';
import { createOnLogoutAction, OnLogout } from './onLogout/onLogout';
import {
  createFormErrorHandlers,
  ErrorHandlers,
} from './errorHandlers/errorHandlers';
import { createSetEmailAction, SetEmail } from './setEmail/setEmail';

export type InternalFormActions = {
  errorHandlers: ErrorHandlers;
  calculatePaymentDetails: CalculatePaymentDetails;
  setPaymentOption: SetPaymentOption;
};
export interface CreateActionParams
  extends ActionFactoryParams<FormState, FormContext> {
  internalActions: InternalFormActions;
}
export type FormControllerActions = {
  onSubmit: OnSubmit;
  setCoupon: SetCoupon;
  removeCoupon: RemoveCoupon;
  setPaymentOption: SetPaymentOption;
  onLogin: OnLogin;
  promptLogin: PromptLogin;
  setNumberOfParticipants: SetNumberOfParticipants;
  setEmail: SetEmail;
  onToggleCoupon: OnToggleCoupon;
  onToastClose: OnToastClose;
  onDialogClose: OnDialogClose;
  initializeWidget: InitializeWidget;
  onLogout: OnLogout;
  setSelectedPaymentType: setSelectedPaymentType;
};
export const createFormActions = (
  actionFactoryParams: ActionFactoryParams<FormState, FormContext>,
): FormControllerActions => {
  const setPaymentOption = createSetPaymentOptionAction(actionFactoryParams);
  const errorHandlers = createFormErrorHandlers(actionFactoryParams);
  const calculatePaymentDetails = createCalculatePaymentDetailsAction({
    actionFactoryParams,
    errorHandlers,
  });
  const internalActions: InternalFormActions = {
    errorHandlers,
    calculatePaymentDetails,
    setPaymentOption,
  };
  const actionParams = { ...actionFactoryParams, internalActions };

  return {
    onSubmit: createOnSubmitAction(actionParams),
    setPaymentOption,
    promptLogin: createPromptLoginAction(actionParams),
    onLogin: createOnLoginAction(actionParams),
    setCoupon: createSetCouponAction(actionParams),
    removeCoupon: createRemoveCouponAction(actionParams),
    setNumberOfParticipants: createSetNumberOfParticipantsAction(actionParams),
    setEmail: createSetEmailAction(actionParams),
    onToggleCoupon: createOnToggleCouponAction(actionParams),
    onToastClose: createOnToastCloseAction(actionParams),
    onDialogClose: createOnDialogCloseAction(actionParams),
    initializeWidget: createInitializeWidgetAction(actionParams),
    onLogout: createOnLogoutAction(actionParams),
    setSelectedPaymentType: createSetSelectedPaymentTypeAction(actionParams),
  };
};
