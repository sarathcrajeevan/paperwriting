'use strict'
import {
    forEach,
    values,
    isEmpty
} from 'lodash-es'
import {
    selectCurrentRecord
} from '../../dataset-controller/rootReducer'

import {
    getFieldValue,
    setValueToComponent,
    shouldUpdateComponentFromRecord,
    addComponentEventListener,
    getLogVerboseBindingDescription,
} from './helpers'

import {
    transformFromRecordToView,
    transformFromViewToRecord,
} from '../transformData'
import baseAdapter from './baseAdapter'

export default ({
    getState,
    errorReporter,
    getFieldType,
    applicationCodeZone,
    databindingVerboseReporter,
    modeIsLivePreview,
}) => {
    const setFieldOnComponentChange = ({
        component,
        properties,
        actions,
        compId,
    }) => {
        addComponentEventListener(
            component,
            'onChange',
            event => {
                const propName = properties.checked ? 'checked' : 'value'
                const fieldName = properties[propName].fieldName
                const record = selectCurrentRecord(getState())

                const value = transformFromViewToRecord({
                    value: event.target[propName],
                    currentValue: record[fieldName],
                    fieldType: getFieldType(fieldName).getOrElse(''),
                    fieldName,
                    utils: {
                        referenceFetcher: (value, fieldName) =>
                            actions.fetchRecordById(value, fieldName).getOrElse(value),
                    },
                })

                actions.setFieldInCurrentRecordAndSynchronize(fieldName, value, compId)
            },
            applicationCodeZone,
        )
    }

    const updateComponentFromCurrentRecord = ({
            connectionConfig: {
                properties
            },
            component,
            role
        },
        actions,
        updatedFields = [],
    ) => {
        const record = selectCurrentRecord(getState())
        if (!record) {
            return
        }
        const valueDescription = {}

        forEach(properties, ({
            fieldName
        }, propPath) => {
            try {
                const fieldType = getFieldType(fieldName).getOrElse('')
                const value = transformFromRecordToView({
                    value: getFieldValue(record, fieldName),
                    role,
                    componentIsInput: true,
                })
                valueDescription[propPath] = value

                if (shouldUpdateComponentFromRecord({
                        updatedFields,
                        fieldName
                    })) {
                    setValueToComponent({
                        component,
                        propPath,
                        value,
                        fieldType,
                        modeIsLivePreview,
                    })
                }
            } catch (e) {
                errorReporter(`Failed setting ${propPath}:`, e)
            }
        })

        databindingVerboseReporter.logValue({
            component,
            valueDescription,
        })
    }

    const syncValidityIndication = ({
        component
    }, actions) => {
        const pristine = actions.isCurrentRecordPristine(getState())
        const newRecord = actions.isCurrentRecordNew(getState())
        if (pristine && newRecord) {
            component.resetValidityIndication && component.resetValidityIndication()
        }
    }

    const sync = actions => () => {
        actions.refresh()
    }

    return {
        ...baseAdapter,

        isValidContext({
            connectionConfig
        }) {
            return values(connectionConfig).find(configValue => !isEmpty(configValue))
        },

        //TODO: the same as in default adapter, remove code duplication
        clearComponent({
            component,
            connectionConfig: {
                properties
            }
        }) {
            forEach(properties, ({
                fieldName
            }, propPath) => {
                const fieldType = getFieldType(fieldName).getOrElse('')
                setValueToComponent({
                    component,
                    propPath,
                    value: undefined,
                    fieldType,
                })
            })
        },

        bindToComponent({
            connectionConfig,
            component,
            compId
        }, actions) {
            const {
                properties,
                filters
            } = connectionConfig

            setFieldOnComponentChange({
                component,
                properties,
                actions,
                compId
            })

            if (filters) {
                addComponentEventListener(
                    component,
                    'onChange',
                    sync(actions),
                    applicationCodeZone,
                )
            }

            databindingVerboseReporter.logBinding({
                component,
                bindingDescription: getLogVerboseBindingDescription(connectionConfig),
            })
        },

        currentRecordModified(componentAdapterContext, actions, updatedFields) {
            updateComponentFromCurrentRecord(
                componentAdapterContext,
                actions,
                updatedFields,
            )
            syncValidityIndication(componentAdapterContext, actions)
        },

        recordSetLoaded(componentAdapterContext, actions) {
            updateComponentFromCurrentRecord(componentAdapterContext, actions)
            syncValidityIndication(componentAdapterContext, actions)
        },

        currentViewChanged(componentAdapterContext, actions) {
            updateComponentFromCurrentRecord(componentAdapterContext, actions)
            syncValidityIndication(componentAdapterContext, actions)
        },

        currentIndexChanged(componentAdapterContext, actions) {
            updateComponentFromCurrentRecord(componentAdapterContext, actions)
            syncValidityIndication(componentAdapterContext, actions)
        },
    }
}