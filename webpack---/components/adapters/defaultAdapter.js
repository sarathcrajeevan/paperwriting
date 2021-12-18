'use strict'
import {
    forEach,
    unescape,
    values,
    isEmpty
} from 'lodash-es'
import {
    TEXT_ROLE
} from '@wix/wix-data-client-common/src/connection-config/roles'
import {
    selectCurrentRecord,
    selectNextDynamicPageUrl,
    selectPreviousDynamicPageUrl,
} from '../../dataset-controller/rootReducer'
import {
    getFieldValue,
    shouldUpdateComponentFromRecord,
    setValueToComponent,
    getLogVerboseBindingDescription,
    getEmptyValueForFieldType,
} from './helpers'
import {
    transformFromRecordToView
} from '../transformData'
import baseAdapter from './baseAdapter'
import {
    FieldType
} from '@wix/wix-data-schema-types'

const {
    url
} = FieldType

export default ({
    getState,
    datasetApi,
    wixSdk,
    errorReporter,
    platformAPIs,
    eventListeners: {
        register
    },
    getFieldType,
    databindingVerboseReporter,
    wixFormatter,
    modeIsLivePreview,
}) => {
    const getNavigateUrl = (navigate, record) => {
        if (navigate.fieldName) {
            return record[navigate.fieldName]
        }

        if (navigate.linkObject) {
            return platformAPIs.links.toUrl(navigate.linkObject)
        }
    }

    const navigateToDynamicPage = dynamicPageUrlState =>
        dynamicPageUrlState.matchWith({
            Empty() {},
            Loading() {},
            Loaded({
                url
            }) {
                wixSdk.location.to(url)
            },
        })

    const bindActionsToComponentEvent = (events, component, actions) => {
        forEach(events, ({
            action,
            postAction
        }, eventName) => {
            component[eventName](async () => {
                try {
                    if (action === 'nextDynamicPage') {
                        navigateToDynamicPage(selectNextDynamicPageUrl(getState()))
                        return
                    }
                    if (action === 'previousDynamicPage') {
                        navigateToDynamicPage(selectPreviousDynamicPageUrl(getState()))
                        return
                    }
                    if (action === 'resetUserFilter') {
                        actions.resetUserInputFilters()
                        return
                    }
                    const record = await Promise.resolve(datasetApi[action]())
                    if (postAction && postAction.navigate) {
                        const url = getNavigateUrl(postAction.navigate, record)
                        wixSdk.location.to(url)
                    }
                } catch (e) {
                    errorReporter(`${action} operation failed:`, e)
                }
            })
        })
    }

    const applyBehaviorsToComponent = (behaviors, component) => {
        forEach(behaviors, ({
            type: behavior
        }) => {
            let ignoreNextIndexChange = false
            switch (behavior) {
                case 'saveSuccessFeedback':
                    register('beforeSave', () => component.hide())
                    register('afterSave', () => {
                        component.show()
                        ignoreNextIndexChange = true
                    })
                    register('currentIndexChanged', () => {
                        if (ignoreNextIndexChange) {
                            ignoreNextIndexChange = false
                        } else {
                            component.hide()
                        }
                    })
                    register('itemValuesChanged', () => component.hide())
                    break
                case 'saveFailureFeedback':
                    register('beforeSave', () => component.hide())
                    register('currentIndexChanged', () => component.hide())
                    register('datasetError', operationName => {
                        if (operationName === 'save') {
                            component.show()
                        }
                    })
                    break
            }
        })
    }

    const handleBehaviors = (behaviors, component) => {
        forEach(behaviors, ({
            type: behavior
        }) => {
            if (behavior === 'saveSuccessFeedback') {
                component.hide()
            }
        })
    }

    const convertTextIntoLink = component => {
        const compText = component.text
        component.text = `<a href=${compText} target="_blank" style="text-decoration: underline">${compText}</a>`
        const compHTML = component.html
        component.text = ''
        component.html = unescape(compHTML)
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
            fieldName,
            format
        }, propPath) => {
            try {
                const fieldType = getFieldType(fieldName).getOrElse('')
                const value = transformFromRecordToView({
                    value: getFieldValue(record, fieldName),
                    role,
                    fieldType,
                    propPath,
                    format,
                    utils: {
                        formatter: wixFormatter,
                        mediaItemUtils: platformAPIs.mediaItemUtils,
                    },
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

                    if (fieldType === url && role === TEXT_ROLE) {
                        convertTextIntoLink(component)
                    }
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

    return {
        ...baseAdapter,

        isValidContext({
            connectionConfig
        }) {
            return values(connectionConfig).find(configValue => !isEmpty(configValue))
        },

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
                    value: getEmptyValueForFieldType(fieldType),
                    fieldType,
                })
            })
        },

        bindToComponent({
            connectionConfig,
            component
        }, actions) {
            const {
                events,
                behaviors
            } = connectionConfig

            if (events) {
                bindActionsToComponentEvent(events, component, actions)
            }

            if (behaviors) {
                applyBehaviorsToComponent(behaviors, component)
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
        },

        recordSetLoaded(componentAdapterContext, actions) {
            updateComponentFromCurrentRecord(componentAdapterContext, actions)

            const {
                behaviors
            } = componentAdapterContext.connectionConfig
            if (behaviors) {
                handleBehaviors(behaviors, componentAdapterContext.component)
            }
        },

        currentViewChanged(componentAdapterContext, actions) {
            updateComponentFromCurrentRecord(componentAdapterContext, actions)
        },

        currentIndexChanged(componentAdapterContext, actions) {
            updateComponentFromCurrentRecord(componentAdapterContext, actions)
        },
    }
}