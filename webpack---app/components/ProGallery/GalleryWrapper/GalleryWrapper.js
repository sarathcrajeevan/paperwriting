import {
    CommonGalleryWrapper
} from '@wix/common-pro-gallery-component-wrapper';
import ProFullscreenWrapper from '../FullscreenWrapper/FullscreenWrapper'; // TODO - remove FullscreenWrapper import when the SSR can accept different bundles
import {
    PRO_GALLERY
} from '../../../constants';
import {
    getResizeMediaUrl
} from '@wix/photography-client-lib';

export default class ProGallerySantaWrapper extends CommonGalleryWrapper {
    isStoreGallery() {
        return false;
    }

    getFullscreenElementIfNeeded() {
        if (!this.canRenderFullscreen()) {
            return null;
        }
        if (typeof ProFullscreenWrapper !== 'undefined') {
            return ProFullscreenWrapper;
        } else if (!this.FullscreenWrapper) {
            import (
                /* webpackChunkName: "FullscreenWrapper" */
                '../FullscreenWrapper/FullscreenWrapper'
            ).then((module) => {
                this.FullscreenWrapper = module.default;
                this.setState({
                    fullscreenWrapperLoaded: true
                });
            });
        }
        return this.FullscreenWrapper || null;
    }

    canRenderFullscreen() {
        return this.getFullscreenSelectedIndex() >= 0;
    }

    getSentryDSN() {
        return PRO_GALLERY.SENTRY_DSN;
    }

    getItemResizer(staticMediaUrls) {
        return getResizeMediaUrl({
            staticMediaUrls
        });
    }

    getGalleryEmptyDynamically() {
        import ( /* webpackChunkName: "galleryEmpty" */ './galleryEmpty').then(
            (module) => {
                this.galleryEmptyComponent = module.default;
                this.setState({
                    galleryEmptyComponentLoaded: true
                });
            },
        );
    }
    getGalleryEmpty() {
        if (!this.galleryEmptyComponent) {
            this.getGalleryEmptyDynamically();
            return null;
        }
        return this.galleryEmptyComponent;
    }
}