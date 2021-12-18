import {
    withStyles
} from '@wix/native-components-infra/dist/es/src/HOC/withStyles/withStyles';
import {
    withSentryErrorBoundary
} from '@wix/native-components-infra/dist/es/src/HOC/sentryErrorBoundary/sentryErrorBoundary';
import GalleryWrapper from './GalleryWrapper';
import {
    PRO_GALLERY
} from '../../../constants';

export default {
    component: withSentryErrorBoundary(
        withStyles(GalleryWrapper, {
            cssPath: 'viewer.css',
            strictMode: false
        }), {
            dsn: PRO_GALLERY.SENTRY_DSN,
            config: {
                environment: 'Native Component'
            },
        },
    ),
};