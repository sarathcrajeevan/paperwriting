'use strict'
import * as modes from '@wix/wix-data-client-common/src/dataset-configuration/readWriteModes'
import isCompConfiguredToReadData from '../helpers/isCompConfiguredToReadData'
import isForm from '../helpers/isForm'
import {
    isEnvEditor
} from '../helpers/viewMode'
import {
    getReadWriteMode,
    getCollectionName,
    selectCurrentRecord,
} from '../dataset-controller/rootReducer'

const {
    READ_WRITE,
    READ
} = modes
const reportDatasetActiveOnPage = (
    biLogger,
    state,
    connections,
    datasetType,
    isScoped,
    datasetId,
    wixSdk,
) => {
    if (isScoped) {
        return
    }
    const collectionName = getCollectionName(state)
    if (!collectionName) {
        return
    }

    const readWriteMode = getReadWriteMode(state)
    const someRecordLoaded = !!selectCurrentRecord(state)

    if (
        someRecordLoaded && [READ_WRITE, READ].includes(readWriteMode) &&
        connections.find(({
                role,
                config
            }) =>
            isCompConfiguredToReadData(role, config),
        )
    ) {
        biLogger({
            evid: isEnvEditor(wixSdk.window.viewMode) ? 153 : 152,
            ds_id: datasetId,
            ds_type: datasetType,
            mode: readWriteMode,
            collection_name: collectionName,
            viewmode: wixSdk.window.viewMode,
            page_url: wixSdk.location.url.split('?')[0],
        })
    }

    if (isForm(getReadWriteMode(state), connections)) {
        biLogger({
            evid: isEnvEditor(wixSdk.window.viewMode) ? 157 : 156,
            ds_id: datasetId,
            ds_type: datasetType,
            mode: readWriteMode,
            collection_name: collectionName,
            viewmode: wixSdk.window.viewMode,
            page_url: wixSdk.location.url.split('?')[0],
        })
    }
}

export {
    reportDatasetActiveOnPage
}