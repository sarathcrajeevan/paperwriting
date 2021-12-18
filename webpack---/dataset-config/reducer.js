'use strict'

import {
    get,
    pick
} from 'lodash-es'
import * as defaultDatasetConfiguration from '@wix/wix-data-client-common/src/dataset-configuration/defaults'
import * as readWriteModes from '@wix/wix-data-client-common/src/dataset-configuration/readWriteModes'
import actionTypes from './actionTypes'
import recordActionTypes from '../records/actionTypes'
import rootActions from '../dataset-controller/actions'
import {
    DETAILS_DATASET_ROLE
} from '@wix/wix-data-client-common/src/connection-config/roles'
import * as datasetTypes from '@wix/wix-data-client-common/src/datasetTypes'

const {
    WRITE
} = readWriteModes
const {
    ROUTER_DATASET
} = datasetTypes
const canonicalConfigProperties = [
    'collectionName',
    'readWriteType',
    'includes',
    'preloadData',
]
const transientConfigProperties = ['filter', 'sort', 'pageSize']

const getCanonicalConfig = datasetConfig =>
    pick(datasetConfig, canonicalConfigProperties)
const getTransientConfig = datasetConfig =>
    pick(datasetConfig, transientConfigProperties)
const getCanonicalCalculatedData = ({
    datasetConfig,
    connections,
    isScoped,
    datasetType,
}) => {
    const datasetIsRouter = datasetType === ROUTER_DATASET
    const datasetIsMaster = connections.some(
        ({
            role
        }) => role === DETAILS_DATASET_ROLE,
    )
    const datasetIsVirtual = isScoped
    const datasetIsReal = !isScoped
    const datasetIsWriteOnly = datasetConfig.readWriteType === WRITE
    const datasetIsDeferred =
        Boolean(datasetConfig.deferred) &&
        !(
            datasetIsVirtual ||
            datasetIsMaster ||
            datasetIsRouter ||
            datasetIsWriteOnly
        )
    const dynamicPageNavComponentsShouldBeLinked =
        datasetIsRouter && datasetIsReal

    return {
        datasetIsRouter,
        datasetIsMaster,
        datasetIsVirtual,
        datasetIsReal,
        datasetIsDeferred,
        dynamicPageNavComponentsShouldBeLinked,
    }
}

const assignTransientData = (state, transientData) => {
    return {
        ...state,

        transientData: {
            ...state.transientData,
            ...transientData,
        },
    }
}

const initialState = {
    canonicalData: getCanonicalConfig(defaultDatasetConfiguration),
    canonicalCalculatedData: {},
    transientData: {
        isDatasetReady: false,
        allowWixDataAccess: undefined,
        ...getTransientConfig(defaultDatasetConfiguration),
    },
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case rootActions.actionTypes.INIT:
            {
                const allowWixDataAccess = get(
                    action, ['datasetConfig', 'preloadData'],
                    true,
                )
                const {
                    datasetConfig,
                    connections,
                    isScoped,
                    datasetType
                } = action
                return {
                    ...state,

                    canonicalData: {
                        ...state.canonicalData,
                        ...getCanonicalConfig(action.datasetConfig),
                    },

                    canonicalCalculatedData: getCanonicalCalculatedData({
                        datasetConfig,
                        connections,
                        isScoped,
                        datasetType,
                    }),
                    transientData: {
                        ...state.transientData,
                        ...getTransientConfig(action.datasetConfig),
                        allowWixDataAccess,
                    },
                }
            }

        case actionTypes.SET_FILTER:
            {
                const {
                    filter
                } = action

                return assignTransientData(state, {
                    filter,
                    allowWixDataAccess: true
                })
            }

        case actionTypes.SET_SORT:
            {
                const {
                    sort
                } = action

                return assignTransientData(state, {
                    sort
                })
            }

        case actionTypes.SET_IS_DATASET_READY:
            {
                const {
                    isDatasetReady
                } = action

                return assignTransientData(state, {
                    isDatasetReady
                })
            }

        case actionTypes.SET_FIXED_FILTER_ITEM:
            {
                const {
                    fixedFilterItem
                } = action

                return assignTransientData(state, {
                    fixedFilterItem
                })
            }

        case recordActionTypes.REFRESH:
            {
                return assignTransientData(state, {
                    allowWixDataAccess: true
                })
            }

        default:
            return state
    }
}

export default {
    reducer,

    isWriteOnly: state =>
        get(state, ['canonicalData', 'readWriteType']) === readWriteModes.WRITE,

    isReadOnly: state =>
        get(state, ['canonicalData', 'readWriteType']) === readWriteModes.READ,

    getReadWriteMode: state => get(state, ['canonicalData', 'readWriteType']),

    isDatasetReady: state => get(state, ['transientData', 'isDatasetReady']),

    isDatasetConfigured: state =>
        !!get(state, ['canonicalData', 'collectionName']),

    isDatasetRouter: ({
            canonicalCalculatedData: {
                datasetIsRouter
            }
        }) =>
        datasetIsRouter,

    isDatasetMaster: ({
            canonicalCalculatedData: {
                datasetIsMaster
            }
        }) =>
        datasetIsMaster,

    isDatasetVirtual: ({
            canonicalCalculatedData: {
                datasetIsVirtual
            }
        }) =>
        datasetIsVirtual,

    isDatasetReal: ({
            canonicalCalculatedData: {
                datasetIsReal
            }
        }) =>
        datasetIsReal,

    isDatasetDeferred: ({
            canonicalCalculatedData: {
                datasetIsDeferred
            }
        }) =>
        datasetIsDeferred,

    shouldLinkDynamicPageNavComponents: ({
        canonicalCalculatedData: {
            dynamicPageNavComponentsShouldBeLinked
        },
    }) => dynamicPageNavComponentsShouldBeLinked,

    getPageSize: state => get(state, ['transientData', 'pageSize']),

    getFixedFilterItem: state => get(state, ['transientData', 'fixedFilterItem']),

    getFilter: state => get(state, ['transientData', 'filter']),

    getSort: state => get(state, ['transientData', 'sort']),

    getIncludes: state => get(state, ['canonicalData', 'includes']) || [],

    getCollectionName: state => get(state, ['canonicalData', 'collectionName']),

    getPreloadData: state => get(state, ['canonicalData', 'preloadData'], true),

    shouldAllowWixDataAccess: state =>
        get(state, ['transientData', 'allowWixDataAccess']),
}