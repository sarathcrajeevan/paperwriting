import { ActionFactoryParams } from '../../../utils/ControlledComponent/ControlledComponent.types';
import { CalendarState } from '../controller';
import { CalendarContext } from '../../../utils/context/contextFactory';
import {
  createInitializeWidgetAction,
  InitializeWidget,
} from './initializeWidget/initializeWidget';
import {
  createOnDateSelectedAction,
  OnDateSelected,
} from './onDateSelected/onDateSelected';
import {
  createGoToNextAvailableDateAction,
  GoToNextAvailableDate,
} from './goToNextAvailableDate/goToNextAvailableDate';
import { createSetSelectedMonthAction } from './setSelectedMonth/setSelectedMonth';
import {
  createOnTimeSelectedAction,
  OnTimeSelected,
} from './onTimeSelected/onTimeSelected';
import {
  createOnBookingPreferenceOptionSelectedAction,
  OnBookingPreferenceOptionSelected,
} from './onBookingPreferenceOptionSelected/onBookingPreferenceOptionSelected';
import {
  createOnTimezoneSelectedAction,
  OnTimezoneSelected,
} from './onTimezoneSelected/onTimezoneSelected';
import { createOnSubmitAction, OnSubmit } from './onSubmit/onSubmit';
import { createRefetchPlatformDataAction } from './refetchPlatformData/refetchPlatformData';
import {
  createOnClearBookingDetailSelectedOptionsAction,
  OnClearBookingDetailSelectedOptions,
} from './onClearBookingDetailSelectedOptions/onClearBookingDetailSelectedOptions';
import { createSetSelectedTimeAction } from './setSelectedTime/setSelectedTime';
import {
  createNavigateToMembersAreaAction,
  NavigateToMembersArea,
} from './navigateToMembersArea/navigateToMembersArea';
import {
  createOnMonthSelectedAction,
  OnMonthSelected,
} from './onMonthSelected/onMonthSelected';
import {
  createOnDialogCloseAction,
  OnDialogClose,
} from './onDialogClose/onDialogClose';
import {
  createOnDialogConfirmAction,
  OnDialogConfirm,
} from './onDialogConfirm/onDialogConfirm';
import {
  createOnFilterChanged,
  OnFilterChanged,
} from './onFilterChanged/onFilterChanged';
import { createSetSelectedDateAction } from './setSelectedDate/setSelectedDate';
import {
  createOnSlotsNotificationCtaClick,
  OnSlotsNotificationCtaClick,
} from './onSlotsNotificationCtaClick/onSlotsNotificationCtaClick';
import {
  createOnToastCloseAction,
  OnToastClose,
} from './onToastClose/onToastClose';
import {
  createOnElementClicked,
  OnElementClicked,
} from './onElementClicked/onElementClicked';
import { createSetFocusedElementAction } from './setFocusedElement/setFocusedElement';
import { createCloseDialogAction } from './closeDialog/closeDialog';
import { createAddErrorAction } from './addError/addError';
import { createRemoveErrorAction } from './removeError/removeError';
import { createOnRangeSetAction, OnRangeSet } from './onRangeSet/onRangeSet';
import { createSetSelectedRangeAction } from './setSelectedRange/setSelectedRange';
import {
  createOnLoginClickAction,
  OnLoginClick,
} from './onLoginClick/onLoginClick';
import { createOnUserLoggedInAction, OnUserLoggedIn } from './onUserLoggedIn/onUserLoggedIn';

export type CalendarActions = {
  initializeWidget: InitializeWidget;
  onDateSelected: OnDateSelected;
  goToNextAvailableDate: GoToNextAvailableDate;
  onMonthSelected: OnMonthSelected;
  onRangeSet: OnRangeSet;
  onTimeSelected: OnTimeSelected;
  onBookingPreferenceOptionSelected: OnBookingPreferenceOptionSelected;
  onSubmit: OnSubmit;
  onClearBookingDetailSelectedOptions: OnClearBookingDetailSelectedOptions;
  onTimezoneSelected: OnTimezoneSelected;
  navigateToMembersArea: NavigateToMembersArea;
  onDialogClose: OnDialogClose;
  onDialogConfirm: OnDialogConfirm;
  onFilterChanged: OnFilterChanged;
  onSlotsNotificationCtaClick: OnSlotsNotificationCtaClick;
  onToastClose: OnToastClose;
  onElementClicked: OnElementClicked;
  onLoginClick: OnLoginClick;
  onUserLoggedIn: OnUserLoggedIn;
};

export const createCalendarActions = (
  actionFactoryParams: ActionFactoryParams<CalendarState, CalendarContext>,
): CalendarActions => {
  const addError = createAddErrorAction(actionFactoryParams);
  const removeError = createRemoveErrorAction(actionFactoryParams);
  const setFocusedElement = createSetFocusedElementAction(actionFactoryParams);
  const setSelectedMonth = createSetSelectedMonthAction(actionFactoryParams);
  const setSelectedTime = createSetSelectedTimeAction(
    actionFactoryParams,
    addError,
  );
  const setSelectedDate = createSetSelectedDateAction(
    actionFactoryParams,
    addError,
    removeError,
    setSelectedTime,
  );
  const setSelectedRange = createSetSelectedRangeAction(
    actionFactoryParams,
    addError,
    setSelectedTime,
  );
  const refetchPlatformData = createRefetchPlatformDataAction(
    actionFactoryParams,
    setSelectedDate,
    setSelectedMonth,
    setSelectedRange,
  );
  const closeDialog = createCloseDialogAction(actionFactoryParams);
  const onDialogClose = createOnDialogCloseAction(
    actionFactoryParams,
    closeDialog,
  );
  const goToNextAvailableDate = createGoToNextAvailableDateAction(
    actionFactoryParams,
    setSelectedDate,
    setSelectedMonth,
    setSelectedRange,
    addError,
  );

  return {
    initializeWidget: createInitializeWidgetAction(
      actionFactoryParams,
      setSelectedDate,
      setSelectedMonth,
      setSelectedRange,
    ),
    onDateSelected: createOnDateSelectedAction(
      actionFactoryParams,
      setSelectedDate,
      setFocusedElement,
    ),
    goToNextAvailableDate,
    onMonthSelected: createOnMonthSelectedAction(
      actionFactoryParams,
      setSelectedMonth,
    ),
    onRangeSet: createOnRangeSetAction(actionFactoryParams, setSelectedRange),
    onTimeSelected: createOnTimeSelectedAction(
      actionFactoryParams,
      setSelectedTime,
      setFocusedElement,
    ),
    onBookingPreferenceOptionSelected: createOnBookingPreferenceOptionSelectedAction(
      actionFactoryParams,
      removeError,
    ),
    onSubmit: createOnSubmitAction(
      actionFactoryParams,
      addError,
      setFocusedElement,
    ),
    onClearBookingDetailSelectedOptions: createOnClearBookingDetailSelectedOptionsAction(
      actionFactoryParams,
    ),
    onTimezoneSelected: createOnTimezoneSelectedAction(
      actionFactoryParams,
      refetchPlatformData,
      setSelectedTime,
    ),
    navigateToMembersArea: createNavigateToMembersAreaAction(
      actionFactoryParams,
    ),
    onFilterChanged: createOnFilterChanged(
      actionFactoryParams,
      refetchPlatformData,
    ),
    onDialogClose,
    onDialogConfirm: createOnDialogConfirmAction(
      actionFactoryParams,
      onDialogClose,
      addError,
    ),
    onSlotsNotificationCtaClick: createOnSlotsNotificationCtaClick(
      goToNextAvailableDate,
    ),
    onToastClose: createOnToastCloseAction(actionFactoryParams, removeError),
    onElementClicked: createOnElementClicked(actionFactoryParams),
    onLoginClick: createOnLoginClickAction(actionFactoryParams),
    onUserLoggedIn: createOnUserLoggedInAction(actionFactoryParams, addError),
  };
};
