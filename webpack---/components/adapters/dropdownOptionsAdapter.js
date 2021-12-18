'use strict'

import {
    isEmpty,
    forEach,
    orderBy,
    uniqBy
} from 'lodash-es'
import {
    getFieldValue
} from './helpers'
import {
    transformFromRecordToView
} from '../transformData'
import {
    getFieldReferencedCollection,
    getSchemaDisplayField,
} from '../../data/utils'
import baseAdapter from './baseAdapter'
import appContext from '../../viewer-app-module/DataBindingAppContext'

const adapter = ({
    getState,
    getFieldType,
    getSchema,
    databindingVerboseReporter,
}) => {
    const {
        features
    } = appContext
    const createOption = (record, fieldName, dataTransformer) => {
        const value = dataTransformer(getFieldValue(record, fieldName))
        return {
            value,
            label: value || '', //TODO: probably don't need this check
        }
    }

    const createOptionForReference = (record, displayField, dataTransformer) => ({
        value: dataTransformer(record._id),
        label: dataTransformer(record[displayField]),
    })

    const fetchDropdownOptions = async (fieldName, actions, dataTransformer) => {
        const isReference = getFieldType(fieldName)
            .map(fieldType => fieldType === 'reference')
            .getOrElse(false)

        if (isReference) {
            return getSchema()
                .chain(schema => {
                    const refCollection = getFieldReferencedCollection(fieldName, schema)
                    return getSchema(refCollection)
                        .map(getSchemaDisplayField)
                        .map(async displayField => {
                            const {
                                items
                            } = await actions.fetchAll(fieldName)

                            const options = orderBy(
                                items.map(record =>
                                    createOptionForReference(
                                        record,
                                        displayField,
                                        dataTransformer,
                                    ),
                                ), [option => option.label.toLowerCase()],
                            )

                            return options
                        })
                })
                .getOrElse(Promise.resolve([]))
        } else if (features.dropdownOptionsDistinct) {
            const uniqueFieldValues = actions.getUniqueFieldValues(fieldName)

            if (uniqueFieldValues) {
                return uniqueFieldValues.map(uniqueValue => {
                    const value = dataTransformer(uniqueValue)
                    return {
                        value,
                        label: value || '', //TODO: probably don't need this check
                    }
                })
            }
        } else {
            // This case happens if exp is off or as a fallback, when exp is on, but comp's value and options are connected to the same field
            // and we don't know whether it's a reference during completeControllerConfig step
            const {
                items
            } = await actions.fetchAll()

            const options = items.map(record =>
                createOption(record, fieldName, dataTransformer),
            )

            return features.dropdownOptionsUnique ? uniqBy(options, 'value') : options
        }
    }

    const handleSingleEmptyOption = options => {
        const firstOption = options[0]
        if (
            options.length === 1 &&
            firstOption.label === '' &&
            firstOption.value === ''
        ) {
            return []
        }
        return options
    }

    const getDropdownOptions = async (fieldName, actions, dataTransformer) =>
        handleSingleEmptyOption(
            await fetchDropdownOptions(fieldName, actions, dataTransformer),
        )

    const updateComponent = async ({
            connectionConfig: {
                properties
            },
            component,
            role
        },
        actions,
    ) => {
        // to allow casting component to any
        // prettier-ignore
        const dropdown = (component)
        if (properties.value && properties.value.fieldName) {
            const options = await getDropdownOptions(
                properties.value.fieldName,
                actions,
                value => transformFromRecordToView({
                    value,
                    role
                }),
            )
            databindingVerboseReporter.logValue({
                component,
                valueDescription: {
                    options
                },
            })
            dropdown.options = options
        }
    }

    const logVerboseForBinding = (component, connectionConfig) => {
        const {
            properties
        } = connectionConfig
        const bindingDescription = {}

        forEach(properties, ({
            fieldName
        }) => {
            bindingDescription.options = fieldName
        })

        databindingVerboseReporter.logBinding({
            component,
            bindingDescription,
        })
    }

    return {
        ...baseAdapter,

        clearComponent({
            component
        }) {
            component.options = []
        },

        isValidContext({
            connectionConfig: {
                properties
            }
        }) {
            return !isEmpty(properties)
        },

        bindToComponent({
            component,
            connectionConfig
        }) {
            logVerboseForBinding(component, connectionConfig)
        },

        currentRecordModified: updateComponent,
        recordSetLoaded: updateComponent,
    }
}

export default adapter