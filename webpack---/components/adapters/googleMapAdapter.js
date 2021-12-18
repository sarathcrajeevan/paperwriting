'use strict'
import {
    selectCurrentRecord,
    selectCurrentRecordIndex,
} from '../../dataset-controller/rootReducer'
import {
    get,
    values,
    isEmpty,
    reduce,
    forEach
} from 'lodash-es'
import {
    getFieldValue
} from './helpers'
import {
    transformFromRecordToView
} from '../transformData'
import baseAdapter from './baseAdapter'

export default ({
    getState,
    wixSdk,
    errorReporter,
    getFieldType,
    databindingVerboseReporter,
    wixFormatter,
}) => {
    const logVerboseForBinding = (component, connectionConfig) => {
        const {
            properties
        } = connectionConfig
        const bindingDescription = {}

        forEach(properties, ({
            fieldName
        }, propName) => {
            bindingDescription[propName] = fieldName
        })
        databindingVerboseReporter.logBinding({
            component,
            bindingDescription,
        })
    }

    const currentRecordModified = ({
        component,
        role,
        connectionConfig: {
            properties
        },
    }) => {
        const record = selectCurrentRecord(getState())
        const currentIndex = selectCurrentRecordIndex(getState())
        component.markers[currentIndex] = createMarkerFromRecord(
            record,
            properties,
            role,
        )
        component.setCenter(get(component, ['markers', currentIndex, 'location']))
    }

    const setCurrentCenterMarkerOfMap = ({
        component
    }) => {
        const currentIndex = selectCurrentRecordIndex(getState())
        component.setCenter(get(component, ['markers', currentIndex, 'location']))
    }

    const createMarkerFromRecord = (record, properties = [], role) =>
        reduce(
            properties,
            (marker, {
                fieldName,
                format
            }, propPath) => {
                const fieldValue = getFieldValue(record, fieldName)
                //TODO: move this transformation to transformFromRecordToView
                if (propPath === 'address') {
                    return Object.assign(marker, {
                        address: get(fieldValue, 'formatted'),
                        location: get(fieldValue, 'location'),
                    })
                } else if (propPath === 'link' && isEmpty(fieldValue)) {
                    return marker
                }

                const convertedValue = transformFromRecordToView({
                    value: getFieldValue(record, fieldName),
                    role,
                    fieldType: getFieldType(fieldName).getOrElse(''),
                    propPath,
                    format,
                    utils: {
                        formatter: wixFormatter,
                    },
                })
                return Object.assign(marker, {
                    [propPath]: convertedValue,
                })
            }, {},
        )

    const updateComponentFromRecords = async ({
            connectionConfig: {
                properties
            },
            component,
            role
        },
        actions,
    ) => {
        try {
            const {
                items: records
            } = await actions.fetchCurrentItems(getState())
            component.markers = records.map(record =>
                createMarkerFromRecord(record, properties, role),
            )
        } catch (e) {
            errorReporter(`Failed setting markers:`, e)
        }
    }

    return {
        ...baseAdapter,

        clearComponent({
            component
        }) {
            component.markers = []
        },

        isValidContext({
            connectionConfig
        }) {
            return values(connectionConfig).find(configValue => !isEmpty(configValue))
        },

        bindToComponent({
            connectionConfig,
            component
        }) {
            logVerboseForBinding(component, connectionConfig)
        },

        currentRecordModified,
        recordSetLoaded: updateComponentFromRecords,
        currentViewChanged: updateComponentFromRecords,

        currentIndexChanged(componentAdapterContext) {
            setCurrentCenterMarkerOfMap(componentAdapterContext)
        },
    }
}