'use strict'

import {
    mapValues
} from 'lodash-es'
import recordActions from '../records/actions'
import actionTypes from './actionTypes'
import {
    DETAILS_DATASET_ROLE
} from '@wix/wix-data-client-common/src/connection-config/roles'
import * as readWriteModes from '@wix/wix-data-client-common/src/dataset-configuration/readWriteModes'
import {
    areDependenciesResolved
} from '../dataset-controller/rootReducer'
import {
    getReadWriteType
} from '../dataset-config/datasetConfigParser'
import DatasetError from '../dataset-api/DatasetError'

const createDependencyEntries = ({
        controllerApi,
        connectionConfig
    }) =>
    mapValues(connectionConfig.filters, ({
        fieldName
    }) => ({
        fieldName,
        controllerApi,
    }))

const resolveDependencies = dependenciesIds => ({
    type: actionTypes.RESOLVE_DEPENDENCIES,
    dependenciesIds,
})

const performHandshakes = dependenciesIds => ({
    type: actionTypes.PERFORM_HANDSHAKES,
    dependenciesIds,
})

export const resolveMissingDependencies = () => ({
    type: actionTypes.RESOLVE_MISSING_DEPENDENCIES,
})

export const setDependencies = dependenciesIds => ({
    type: actionTypes.SET_DEPENDENCIES,
    dependenciesIds,
})

export const performHandshake = (
    dependenciesManager,
    dispatch, {
        controllerApi,
        controllerConfig,
        controllerConfigured,
        connectionConfig,
        role,
    },
) => {
    if (role === DETAILS_DATASET_ROLE) {
        const entries = createDependencyEntries({
            controllerApi,
            connectionConfig
        })
        const dependenciesIds = Object.keys(entries)

        if (controllerConfigured) {
            dependenciesManager.add(entries)
            dispatch(performHandshakes(dependenciesIds))
        }

        try {
            //controllerApi === masterDatasetApi
            const onReadyHandle = controllerApi.onReady(() => {
                dispatch(resolveDependencies(dependenciesIds))

                const masterReadWriteType = getReadWriteType(controllerConfig.dataset)

                if (masterReadWriteType !== readWriteModes.WRITE) {
                    const indexHandle = controllerApi.onCurrentIndexChanged(() =>
                        dispatch(recordActions.refresh()),
                    )
                    dependenciesManager.saveHandle(indexHandle)
                }

                if (masterReadWriteType !== readWriteModes.READ) {
                    const valuesHandle = controllerApi.onItemValuesChanged(() =>
                        dispatch(recordActions.refresh()),
                    )
                    dependenciesManager.saveHandle(valuesHandle)
                }
            })
            dependenciesManager.saveHandle(onReadyHandle)
        } catch {
            // eslint-disable-next-line no-console
            console.error(
                new DatasetError(
                    'DS_EMPTY_URL_FIELD',
                    `The dataset cannot filter by the dynamic dataset because the field used to build this page's URL is empty`,
                ),
            )
        }
    }
}

export const waitForDependencies = store =>
    new Promise(resolve => {
        if (areDependenciesResolved(store.getState())) {
            resolve()
        } else {
            const unsubscribe = store.subscribe(() => {
                if (areDependenciesResolved(store.getState())) {
                    unsubscribe()
                    resolve()
                }
            })
        }
    })