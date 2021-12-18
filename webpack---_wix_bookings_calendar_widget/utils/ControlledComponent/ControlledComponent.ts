import { IWidgetControllerConfig } from '@wix/native-components-infra/dist/src/types/types';
import {
  ActionsFactory,
  SetState,
  StateChangeCallback,
  GetControllerState,
  ViewModelFactory,
} from './ControlledComponent.types';
import { debounce } from 'lodash';
import { BASE_DELAY } from '../../constants/constants';

export async function createControlledComponent<
  ControllerStateType,
  ControllerActionTypes,
  ControllerViewModelType,
  ContextType
>({
  controllerConfig,
  initialState,
  viewModelFactory,
  actionsFactory,
  context,
}: {
  controllerConfig: IWidgetControllerConfig;
  initialState: ControllerStateType;
  viewModelFactory: ViewModelFactory<
    ControllerStateType,
    ControllerViewModelType,
    ContextType
  >;
  actionsFactory: ActionsFactory<
    ControllerStateType,
    ControllerActionTypes,
    ContextType
  >;
  context: ContextType;
}): Promise<{
  onStateChange: (callback: StateChangeCallback<ControllerStateType>) => void;
  render: () => Promise<void>;
  controllerActions: ControllerActionTypes;
  setState: Function;
}> {
  const { setProps } = controllerConfig;
  let state: ControllerStateType = initialState;
  const stateChangedListeners: StateChangeCallback<ControllerStateType>[] = [];

  const onStateChange = (
    callback: StateChangeCallback<ControllerStateType>,
  ) => {
    stateChangedListeners.push(callback);
  };

  const applyState = debounce(() => {
    stateChangedListeners.forEach((listener) => listener(state));
    render();
  }, BASE_DELAY);

  const setState: SetState<ControllerStateType> = (
    stateToUpdate: Partial<ControllerStateType>,
  ) => {
    state = { ...state, ...stateToUpdate };
    applyState();
  };

  const getControllerState: GetControllerState<ControllerStateType> = () => [
    state,
    setState,
  ];

  const controllerActions = actionsFactory({
    getControllerState,
    context,
  });

  const render = async (initial = false) => {
    const viewModel = viewModelFactory({
      state,
      context,
    });
    setProps({ ...viewModel, ...(initial ? controllerActions : {}) });
  };

  await render(true);

  return { onStateChange, render, controllerActions, setState };
}
