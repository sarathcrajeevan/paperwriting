import {
    CommonFullscreenWrapper
} from '@wix/common-pro-gallery-component-wrapper';
import '../../../styles/dynamic/commonDynamicCss.global.scss';

export default class ProFullscreenWrapper extends CommonFullscreenWrapper {
    getFullscreenElement() {
        return this.state.proFullscreenLoaded && this.FullscreenElement ?
            this.FullscreenElement :
            null;
    }
}