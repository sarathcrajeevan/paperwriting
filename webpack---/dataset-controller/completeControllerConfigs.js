import {
    merge,
    values,
    includes,
    defaultsDeep,
    compact
} from 'lodash-es'

import {
    DATASET,
    ROUTER_DATASET,
} from '@wix/wix-data-client-common/src/datasetTypes'
import {
    DETAILS_DATASET_ROLE,
    DROPDOWN_OPTIONS_ROLE,
    DROPDOWN_ROLE,
} from '@wix/wix-data-client-common/src/connection-config/roles'
import * as modes from '@wix/wix-data-client-common/src/dataset-configuration/readWriteModes'
import * as defaultDatasetConfiguration from '@wix/wix-data-client-common/src/dataset-configuration/defaults'
import {
    hasDynamicFilter
} from '../filter-resolvers'
import {
    PRIMARY,
    REGULAR,
    UNCONFIGURED
} from '../data/sequenceType'
import appContext from '../viewer-app-module/DataBindingAppContext'

const {
    WRITE
} = modes
const COMP_ROLES_FOR_UNIQUE_VALUES = [DROPDOWN_OPTIONS_ROLE]
const COMP_ROLES_TO_BLOCK_UNIQUE_VALUES = [DROPDOWN_ROLE]
const PROP_FOR_UNIQUE_VALUES = 'value'

const getDatasetSequenceType = ({
    collectionId,
    datasetHasDynamicFilter,
    datasetIsDeferred,
    datasetIsRouter,
    datasetIsWriteOnly,
}) => {
    if (!collectionId) return UNCONFIGURED
    return !datasetHasDynamicFilter &&
        !datasetIsDeferred &&
        !datasetIsRouter &&
        !datasetIsWriteOnly ?
        PRIMARY :
        REGULAR
}

const getStaticDatasetConfig = (datasetConfig, datasetType, connections) => {
    const {
        dataset: {
            readWriteType,
            deferred,
            filter,
            collectionName: collectionId,
        } = {},
    } = datasetConfig
    const datasetIsWriteOnly = readWriteType === WRITE
    const datasetIsMaster = connections.some(
        ({
            role
        }) => role === DETAILS_DATASET_ROLE,
    )
    const datasetIsRouter = datasetType === ROUTER_DATASET
    const datasetIsDeferred =
        Boolean(deferred) &&
        !(datasetIsMaster || datasetIsRouter || datasetIsWriteOnly)

    const datasetHasDynamicFilter = filter && hasDynamicFilter(filter)

    const sequenceType = getDatasetSequenceType({
        collectionId,
        datasetHasDynamicFilter,
        datasetIsDeferred,
        datasetIsRouter,
        datasetIsWriteOnly,
    })

    //TODO: migrate these calculations in redux store, or get rid of redux for dataset settings
    return {
        sequenceType,
        datasetIsWriteOnly,
        datasetIsMaster,
        datasetIsRouter,
        datasetIsDeferred,
        datasetHasDynamicFilter,
    }
}

const mergeRouterDatasetConfig = (routerConfig, controllerConfig) =>
    merge({}, controllerConfig, routerConfig)

const getFieldKeysForUniqueValues = connections => {
    const compIdsToRolesMap = connections.reduce(
        (acc, {
            config,
            role,
            compId
        }) => {
            const fieldName = config ? .properties ? .[PROP_FOR_UNIQUE_VALUES] ? .fieldName
            if (!fieldName) return acc
            const mapKey = `${compId}-${fieldName}`

            if (COMP_ROLES_TO_BLOCK_UNIQUE_VALUES.includes(role)) {
                // If comp has two connections to value and options it might be reference usecase. We shouldn't use distinct in this case
                // So exclude it from this flow and use fallback fetch from adapter
                acc.set(mapKey, null)
                return acc
            }

            if (COMP_ROLES_FOR_UNIQUE_VALUES.includes(role) && !acc.has(mapKey)) {
                acc.set(mapKey, fieldName)
            }

            return acc
        },
        new Map(),
    )

    return {
        uniqueFieldValues: compact(Array.from(compIdsToRolesMap.values())),
    }
}

const extendDataset = (dataset, connections) => ({
    ...defaultDatasetConfiguration,
    ...dataset,
    ...(appContext.features.dropdownOptionsDistinct ?
        getFieldKeysForUniqueValues(connections) :
        {}),
})

const completeControllerConfigs = (controllerConfigs, routerPayload) => {
    //TODO: Split completeControllerConfig. Use new format for dataFetcher instead
    const datasetTypes = values({
        DATASET,
        ROUTER_DATASET,
    })

    return controllerConfigs.map(controllerConfig => {
        const {
            type
        } = controllerConfig
        if (!includes(datasetTypes, type)) {
            throw new Error(
                `type of controller MUST be one of ${datasetTypes} but is ${type}`,
            )
            //TODO: do not throw an error, only log it
        }
        const {
            config,
            connections
        } = controllerConfig

        const mergedConfig =
            type === ROUTER_DATASET ?
            mergeRouterDatasetConfig(routerPayload ? .config, config) :
            config

        const datasetConfiguration = defaultsDeep({}, mergedConfig, {
            dataset: extendDataset(mergedConfig.dataset, connections),
            datasetStaticConfig: getStaticDatasetConfig(
                mergedConfig,
                type,
                connections,
            ), // TODO: Refactor all config, merge with dataset
        })

        return {
            ...controllerConfig,
            config: datasetConfiguration,
        }
    })
}

export default completeControllerConfigs