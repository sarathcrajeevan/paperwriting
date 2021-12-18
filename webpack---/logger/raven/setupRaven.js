'use strict'

import {
    identity,
    mapValues,
    omit,
    has
} from 'lodash-es'
import {
    configureForViewerWorker
} from '@wix/dbsm-common/src/raven/configureForViewerWorker'

const addDataFixer = raven => {
    const removeRecordsIfExists = value =>
        has(value, 'state.records') ? omit(value, 'state.records') : value

    const removeUserData = data => mapValues(data, removeRecordsIfExists)

    raven.setDataCallback((data, originalCallback = identity) => {
        const finalData = originalCallback(data)
        finalData.extra = removeUserData(finalData.extra)

        return finalData
    })
}

export default ({
    Raven,
    globalScope,
    dsn,
    params,
    appName,
    user
}) => {
    configureForViewerWorker({
        Raven,
        globalScope,
        dsn,
        params,
        appName
    })

    addDataFixer(Raven)
    Raven.setUserContext(user)
}