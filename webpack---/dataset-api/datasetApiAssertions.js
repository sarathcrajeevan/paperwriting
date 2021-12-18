'use strict'

import {
    includes,
    isFunction,
    isNumber,
    isInteger
} from 'lodash-es'
import {
    isDatasetConfigured,
    getReadWriteMode,
    isDuringSave,
    isDatasetReady,
    selectCurrentRecordIndex,
} from '../dataset-controller/rootReducer'
import * as DATASET_TYPES from '@wix/wix-data-client-common/src/datasetTypes'
import DatasetError from './DatasetError'
import * as modes from '@wix/wix-data-client-common/src/dataset-configuration/readWriteModes'

const {
    READ,
    WRITE,
    READ_WRITE
} = modes
const datasetModeToMessage = {
    [READ]: 'read-only',
    [WRITE]: 'write-only',
    [READ_WRITE]: 'read-write',
}

const assertDatasetConfigured = (getState, operationName, datasetType) => {
    if (!isDatasetConfigured(getState())) {
        throw new DatasetError(
            'OPERATION_NOT_ALLOWED',
            datasetType === DATASET_TYPES.ROUTER_DATASET ?
            `Operation (${operationName}) is not allowed because the field used to build this page's URL is empty` :
            `Operation (${operationName}) not allowed on an unconfigured dataset`,
        )
    }
}

const assertDatasetMode = (getState, operationName, allowedModes = []) => {
    const readWriteMode = getReadWriteMode(getState())
    if (!includes(allowedModes, readWriteMode)) {
        throw new DatasetError(
            'OPERATION_NOT_ALLOWED',
            `Operation (${operationName}) not allowed on ${datasetModeToMessage[readWriteMode]} dataset`,
        )
    }
}

const assertSaveNotInProgress = (getState, operationName) => {
    if (isDuringSave(getState())) {
        throw new DatasetError(
            'OPERATION_NOT_ALLOWED',
            `Operation (${operationName}) not allowed during save`,
        )
    }
}

const assertDatasetLimitations = (
    getState,
    operationName = '',
    allowedModes,
    datasetType,
    isSupportedDuringSave = true,
) => {
    assertDatasetConfigured(getState, operationName, datasetType)
    assertDatasetMode(getState, operationName, allowedModes)
    if (!isSupportedDuringSave) {
        assertSaveNotInProgress(getState, operationName)
    }
}

const assertValidIndex = index => {
    if (!isInteger(index)) {
        throw new DatasetError(
            'PARAMETER_NOT_ALLOWED',
            `Parameter (${index}) must be a number`,
        )
    }
}

const assertValidNumberArgument = (argName, argValue) => {
    if (!isNumber(argValue)) {
        throw new DatasetError(
            'DS_INVALID_ARGUMENT',
            `Parameter (${argName}) must be a number`,
        )
    }
}

const assertValidNaturalNumber = (argName, argValue) => {
    if (!isInteger(argValue) || argValue < 1) {
        throw new DatasetError(
            'DS_INVALID_ARGUMENT',
            `Parameter (${argName}) must be a positive integer number`,
        )
    }
}

const assertValidPageIndex = (pageIndex, totalPageCount) => {
    assertValidNaturalNumber('pageNumber', pageIndex)
    if (pageIndex > totalPageCount) {
        throw new DatasetError('NO_SUCH_PAGE', `Page ${pageIndex} does not exist`)
    }
}

const assertValidCallback = (operationName, cb) => {
    if (!isFunction(cb)) {
        throw new DatasetError(
            'DS_INVALID_ARGUMENT',
            `The callback passed to (${operationName}) must be a function`,
        )
    }
}

const assertValidFilter = filter => {
    if (!filter || !isFunction(filter._build)) {
        throw new DatasetError(
            'DS_INVALID_ARGUMENT',
            `The given filter object is invalid`,
        )
    }
}

const assertValidSort = sort => {
    if (!sort || !isFunction(sort._build)) {
        throw new DatasetError(
            'DS_INVALID_ARGUMENT',
            `The given sort object is invalid`,
        )
    }
}

const assertDatasetReady = (getState, operationName) => {
    if (!isDatasetReady(getState())) {
        throw new DatasetError(
            'DS_NOT_LOADED',
            `The dataset didn't load yet. You need to call ${operationName} inside the onReady for the dataset.`,
        )
    }
}

const assertHasCurrentItem = getState => {
    const index = selectCurrentRecordIndex(getState())
    if (index == null) {
        throw new DatasetError('DS_NO_CURRENT_ITEM', 'There is no current item')
    }
}

const assertScopeIsNotFixedItem = (isFixedItem, operationName) => {
    if (isFixedItem) {
        throw new DatasetError(
            'OPERATION_NOT_ALLOWED',
            `The "${operationName}" function cannot be called on the dataset because the dataset was selected using a repeated item scope selector.\nRead more about repeated item scope selectors: http://wix.to/94BuAAs/$w.Repeater.html#repeated-item-scope`,
        )
    }
}

const assertDatasetTypeIsRouter = (datasetType, operationName) => {
    if (datasetType !== DATASET_TYPES.ROUTER_DATASET) {
        throw new DatasetError(
            'OPERATION_NOT_ALLOWED',
            `"${operationName}" function on the dataset is not allowed. "${operationName}" can only be called on a Dynamic Page Dataset.`,
        )
    }
}

const assetValidHandshakeInfo = handshakeInfo => {
    if (!handshakeInfo ||
        !handshakeInfo.controllerApi ||
        !handshakeInfo.role ||
        !handshakeInfo.connectionConfig
    ) {
        throw new Error('Handshake info is invalid')
    }
}

export {
    assertDatasetLimitations,
    assertDatasetReady,
    assertHasCurrentItem,
    assertScopeIsNotFixedItem,
    assertValidCallback,
    assertValidFilter,
    assertValidIndex,
    assertValidNumberArgument,
    assertValidSort,
    assertValidNaturalNumber,
    assertValidPageIndex,
    assertDatasetTypeIsRouter,
    assetValidHandshakeInfo,
}