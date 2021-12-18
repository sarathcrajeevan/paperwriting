'use strict'

import {
    get,
    isEmpty,
    includes,
    values,
    forEach
} from 'lodash-es'
import {
    addComponentEventListener,
    getFieldValue
} from './helpers'
import baseAdapter from './baseAdapter'
import {
    transformFromViewToRecord
} from '../transformData'
import {
    selectCurrentRecord,
    isReadOnly,
} from '../../dataset-controller/rootReducer'

const getValueFieldName = connectionConfig =>
    get(connectionConfig, 'properties.value.fieldName')

export default ({
    getState,
    datasetApi,
    errorReporter,
    getFieldType,
    applicationCodeZone,
    databindingVerboseReporter,
    platformAPIs: {
        mediaItemUtils
    },
    appLogger,
}) => {
    const modified = {}

    const resetComponent = component => {
        if (component.reset) {
            component.reset()
        }
    }

    const syncValidityIndicationAndValue = ({
            component,
            connectionConfig
        },
        actions,
        valueFieldChanged = false,
    ) => {
        const record = selectCurrentRecord(getState())
        const fieldName = getValueFieldName(connectionConfig)

        const newRecord = actions.isCurrentRecordNew(getState())
        const valueIsInvalid = isEmpty(getFieldValue(record, fieldName))
        const pristine = actions.isCurrentRecordPristine(getState())

        if (pristine || valueFieldChanged) {
            resetComponent(component)
        }

        if (valueIsInvalid && (!newRecord || valueFieldChanged)) {
            component.updateValidityIndication()
        }
    }

    return {
        ...baseAdapter,

        clearComponent({
            component
        }) {
            resetComponent(component)
        },

        isValidContext({
            connectionConfig
        }) {
            return values(connectionConfig).find(configValue => !isEmpty(configValue))
        },

        bindToComponent({
            connectionConfig,
            component,
            compId,
            role
        }, actions) {
            if (isReadOnly(getState())) {
                return
            }

            const fieldName = getValueFieldName(connectionConfig)
            const fieldType = getFieldType(fieldName).getOrElse('')

            addComponentEventListener(
                component,
                'onChange',
                () => {
                    modified[compId] = true
                },
                applicationCodeZone,
            )

            const startFilesUpload = component => {
                //TODO: revert this commit as soon as Bolt RIP or consistently supports uploadFiles API
                if (typeof component.uploadFiles !== 'function') {
                    appLogger.error('uploadFiles API method is not supported by Platform')
                    return component.startUpload()
                }
                return component.uploadFiles()
            }

            datasetApi.onBeforeSave(() => {
                if (modified[compId] && component.value.length) {
                    return startFilesUpload(component).then(
                        uploadResult => {
                            modified[compId] = false

                            const record = selectCurrentRecord(getState())
                            const value = transformFromViewToRecord({
                                value: Array.isArray(uploadResult) ?
                                    uploadResult :
                                    [uploadResult],
                                currentValue: getFieldValue(record, fieldName),
                                fieldType,
                                fieldName,
                                role,
                                utils: {
                                    mediaItemUtils
                                },
                            })

                            actions.setFieldInCurrentRecordAndSynchronize(
                                fieldName,
                                value,
                                compId,
                            )
                        },
                        e => {
                            const expectedFiles = component.value
                            const expectedFileName =
                                Array.isArray(expectedFiles) && expectedFiles.length === 1 ?
                                expectedFiles[0].name :
                                'unknown'
                            errorReporter(
                                `The ${expectedFileName} file failed to upload. Please try again later.`,
                                e,
                            )
                            throw e
                        },
                    )
                }
            })

            // eslint-disable-next-line array-callback-return
            getFieldType(fieldName).map(fieldType => {
                switch (fieldType) {
                    case 'image':
                        component.fileType = 'Image'
                        break
                    case 'document':
                        component.fileType = 'Document'
                        break
                }
            })

            const {
                properties
            } = connectionConfig
            forEach(properties, ({
                fieldName
            }, propName) => {
                databindingVerboseReporter.logBinding({
                    component,
                    bindingDescription: {
                        [propName]: fieldName,
                    },
                })
            })
        },

        currentRecordModified({
                component,
                connectionConfig,
                compId
            },
            actions,
            updatedFields,
        ) {
            const fieldName = getValueFieldName(connectionConfig)
            const valueFieldChanged = includes(updatedFields, fieldName)
            if (valueFieldChanged) {
                modified[compId] = false
            }
            syncValidityIndicationAndValue({
                    component,
                    connectionConfig
                },
                actions,
                valueFieldChanged,
            )
        },

        recordSetLoaded(componentAdapterContext, actions) {
            syncValidityIndicationAndValue(componentAdapterContext, actions)
        },

        currentViewChanged(componentAdapterContext, actions) {
            syncValidityIndicationAndValue(componentAdapterContext, actions)
        },

        currentIndexChanged(componentAdapterContext, actions) {
            syncValidityIndicationAndValue(componentAdapterContext, actions)
        },
    }
}