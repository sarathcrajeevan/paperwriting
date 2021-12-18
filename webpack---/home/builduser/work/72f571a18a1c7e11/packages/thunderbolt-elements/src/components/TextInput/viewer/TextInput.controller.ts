import { IComponentController } from '@wix/editor-elements-types';
import { ITextInputControllerActions } from '../TextInput.types';

const mapActionsToProps: IComponentController = ({
  updateProps,
}): ITextInputControllerActions => ({
  onValueChange: value => {
    updateProps({
      value,
    });
  },
  setValidityIndication: (shouldShowValidityIndication: boolean) => {
    updateProps({
      shouldShowValidityIndication,
    });
  },
});

export default mapActionsToProps;
