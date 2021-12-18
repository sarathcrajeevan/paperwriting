import LoginSocialBarComponent from '@wix/thunderbolt-elements/src/components/LoginSocialBar/viewer/LoginSocialBar';
import LoginSocialBarController from '@wix/thunderbolt-elements/src/components/LoginSocialBar/viewer/LoginSocialBar.controller';


const LoginSocialBar = {
  component: LoginSocialBarComponent,
  controller: LoginSocialBarController
};


export const components = {
  ['LoginSocialBar']: LoginSocialBar
};


// temporary export
export const version = "1.0.0"
