import {
    BI_SOURCE,
    BI_ENDPOINT as BI_VIEWER_ENDPOIINT_PREVIEW,
    BI_VIEWER_ENDPOINT as BI_VIEWER_ENDPOINT_LIVE,
} from '@wix/dbsm-common/src/bi/constants'

import {
    DATA_BINDING
} from '@wix/app-definition-ids'
import {
    getAppUrl
} from '@wix/dbsm-common/src/worker/getUrl'
import getAppVersion from '@wix/dbsm-common/src/getAppVersion'
import {
    isEnvEditor
} from '../../helpers/viewMode'

const APP_NAME = 'dbsm-viewer-app'

const biDefaults = {
    src: BI_SOURCE,
    ver: getAppVersion(getAppUrl(APP_NAME)),
    app_name: APP_NAME,
    app_id: DATA_BINDING,
}

const getEndpointByViewMode = viewMode =>
    isEnvEditor(viewMode) ? BI_VIEWER_ENDPOIINT_PREVIEW : BI_VIEWER_ENDPOINT_LIVE

const setupBiLogger = (viewMode, defaults, biLoggerFactory) =>
    biLoggerFactory()
    .updateDefaults({
        ...biDefaults,
        ...defaults,
    })
    .logger({
        endpoint: getEndpointByViewMode(viewMode)
    })

export {
    setupBiLogger
}