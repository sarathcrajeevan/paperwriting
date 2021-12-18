import { ControllerParams, CreateControllerFn } from '@wix/yoshi-flow-editor';
import {
  createInitialState,
  FormState,
} from '../../utils/state/initialStateFactory';
import { createControlledComponent } from '../../utils/ControlledComponent/ControlledComponent';
import {
  createFormContext,
  FormContext,
} from '../../utils/context/contextFactory';
import { createFormActions, FormControllerActions } from './Actions/actions';
import { createWixSdkAdapter } from '../../utils/sdkAdapterFactory';
import { FormApi } from '../../api/FormApi';
import { mapConfigToState } from '../../utils/dummies/editor-behaviour';
import { ITEM_TYPES } from '@wix/advanced-seo-utils/api';
import { getSeoItemData } from '../../utils/seo/seo';
import { createFormBiLogger } from '../../utils/bi/biLoggerFactory';
import { FormStatus } from '../../types/form-state';

const createController: CreateControllerFn = async ({
  flowAPI: flowApi,
}: ControllerParams) => {
  let rerender: (
    propsToUpdate: Partial<FormState | { actions: FormControllerActions }>,
  ) => void = () => {};
  return {
    async pageReady() {
      const {
        controllerConfig,
        translations: { t },
        reportError,
      } = flowApi;

      const wixSdkAdapter = createWixSdkAdapter(controllerConfig);
      const formApi = new FormApi({ wixSdkAdapter, reportError });
      const initialState: FormState = await createInitialState({
        wixSdkAdapter,
        flowApi,
        formApi,
        t,
      });

      const shouldInitializeBiLogger =
        flowApi?.bi! && isFormInValidState(initialState);
      const biLogger = shouldInitializeBiLogger
        ? createFormBiLogger({
            viewerBiLogger: flowApi?.bi!,
            formState: initialState,
            wixSdkAdapter,
          })
        : undefined;

      const formContext: FormContext = createFormContext({
        t,
        flowApi,
        wixSdkAdapter,
        formApi,
        biLogger,
        reportError,
      });

      const {
        render,
        actions,
        onStateChange,
      } = await createControlledComponent<
        FormState,
        FormControllerActions,
        FormContext
      >({
        controllerConfig,
        initialState,
        actionsFactory: createFormActions,
        context: formContext,
      });
      rerender = render;

      if (!wixSdkAdapter.isSSR()) {
        onStateChange((state) => {
          biLogger?.update(state);
        });
      }

      wixSdkAdapter.onUserLogin(actions.onLogin);
      await wixSdkAdapter.renderSeoTags(
        ITEM_TYPES.BOOKINGS_FORM,
        await getSeoItemData(initialState, wixSdkAdapter, t),
      );
    },
    updateConfig($w, config) {
      const stateUpdate = mapConfigToState(config);
      rerender(stateUpdate);
    },
  };
};

function isFormInValidState(formState: FormState) {
  return formState.status && formState.status !== FormStatus.SSR;
}

export default createController;
