import TextAreaInputComponent from '@wix/thunderbolt-elements/src/components/TextAreaInput/viewer/TextAreaInput';
import TextAreaInputController from '@wix/thunderbolt-elements/src/components/TextAreaInput/viewer/TextAreaInput.controller';


const TextAreaInput = {
  component: TextAreaInputComponent,
  controller: TextAreaInputController
};


export const components = {
  ['TextAreaInput']: TextAreaInput
};


// temporary export
export const version = "1.0.0"
