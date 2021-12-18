import { IWidgetControllerConfig } from '@wix/native-components-infra/dist/src/types/types';
import {
  ActionsFactory,
  SetState,
  StateChangeCallback,
  GetControllerState,
} from './ControlledComponent.types';

export async function createControlledComponent<
  ControllerStateType,
  ControllerActionTypes,
  ContextType
>({
  controllerConfig,
  initialState,
  actionsFactory,
  context,
}: {
  controllerConfig: IWidgetControllerConfig;
  initialState: ControllerStateType;
  actionsFactory: ActionsFactory<
    ControllerStateType,
    ControllerActionTypes,
    ContextType
  >;
  context: ContextType;
}): Promise<{
  onStateChange: (callback: StateChangeCallback<ControllerStateType>) => void;
  render: (
    propsToUpdate: Partial<
      ControllerStateType | { actions: ControllerActionTypes }
    >,
  ) => void;
  actions: ControllerActionTypes;
}> {
  const { setProps } = controllerConfig;
  let state: ControllerStateType = initialState;
  const stateChangedListeners: StateChangeCallback<ControllerStateType>[] = [];

  const updateState = (stateToUpdate: Partial<ControllerStateType>) => {
    state = { ...state, ...stateToUpdate };
  };

  const onStateChange = (
    callback: StateChangeCallback<ControllerStateType>,
  ) => {
    stateChangedListeners.push(callback);
  };

  const notifyStateChangedListeners = (newState: ControllerStateType) => {
    stateChangedListeners.forEach((listener) => listener(state));
  };

  const setState: SetState<ControllerStateType> = (
    stateToUpdate: Partial<ControllerStateType>,
  ) => {
    updateState(stateToUpdate);
    render(stateToUpdate);
    notifyStateChangedListeners(state);
  };

  const getControllerState: GetControllerState<ControllerStateType> = () => [
    state,
    setState,
  ];

  const controllerActions = actionsFactory({
    getControllerState,
    context,
  });

  const render = (
    propsToUpdate: Partial<
      ControllerStateType | { actions: ControllerActionTypes }
    > = state,
  ) => {
    setProps({
      ...propsToUpdate,
    });
  };

  render({
    ...initialState,
    actions: controllerActions,
  });

  return { onStateChange, render, actions: controllerActions };
}
