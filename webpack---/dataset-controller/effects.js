'use strict'

import {
    forEach,
    isBoolean,
    isEqual,
    mapValues,
    pickBy
} from 'lodash-es'
import {
    Maybe
} from '@wix/wix-code-adt'
import {
    breadcrumbWrapper
} from '../logger'
import {
    generateAutomationsFieldName,
    isFieldSupported,
} from '@wix/wix-code-automations-client'
import DatasetError from '../dataset-api/DatasetError'
import {
    verboseEvent
} from '../dataset-api/verbosity'
import recordsActions from '../records/actions'
import isComponentValid from '../helpers/isComponentValid'
import convertValueToString from '../components/transformData/convertValueToString' //TODO: consider using transformFromRecordToView
import getFieldValue from '../helpers/getFieldValue'

const isFalse = val => isEqual(false, val)

function convertToFieldType(fieldType, value) {
    switch (fieldType) {
        case 'number':
            {
                return Number(value)
            }

        case 'boolean':
            {
                if (typeof value === 'string') {
                    return value.toLowerCase() === 'true' || value.toLowerCase() === '1'
                }
                break
            }

        case 'text':
            {
                if (value != null && typeof value.toString === 'function') {
                    return value.toString()
                }
                break
            }
    }

    return value
}

function ensureSchemaTypes(getFieldType, record) {
    return mapValues(record, (value, fieldName) =>
        getFieldType(fieldName)
        .map(fieldType => convertToFieldType(fieldType, value))
        .getOrElse(value),
    )
}

function effectsCreator(
    recordStore,
    adapterApi,
    getFieldType,
    executeHooks,
    logger,
    controllerId,
    componentAdapterContexts,
    getSchema,
    datasetCollectionName,
    reportFormEventToAutomation,
    fireEvent,
    verboseReporter,
) {
    const sanitiseUserData = ['setFieldsInCurrentRecord']
    const createBreadcrumb = (fnName, args) => ({
        category: 'effects',
        level: 'info',
        message: `${fnName}(${
      sanitiseUserData.includes(fnName)
        ? `..${args.length} arguments..`
        : args.map(JSON.stringify)
    }) (${controllerId})`,
        data: {},
    })

    const {
        withBreadcrumbs,
        withBreadcrumbsAsync
    } = breadcrumbWrapper(
        logger,
        createBreadcrumb,
        _ => _,
    )

    function updateComponents(
        componentIdToExcludeFromUpdatingComponentsBasedOnRecord,
        updatedFields,
    ) {
        adapterApi().currentRecordModified(
            updatedFields,
            componentIdToExcludeFromUpdatingComponentsBasedOnRecord,
        )
    }

    function executeBeforeSaveHooks() {
        verboseEvent(verboseReporter, 'beforeSave')
        return executeHooks('beforeSave')
            .then(hookResults => hookResults.some(isFalse))
            .catch(e => ({
                error: e
            }))
            .then(shouldCancelSave => {
                if (shouldCancelSave) {
                    throw new DatasetError(
                        'DS_OPERATION_CANCELLED',
                        `Operation cancelled by user code. ${
              isBoolean(shouldCancelSave) ? '' : shouldCancelSave.error
            }`,
                    )
                }
            })
    }

    function removeRecordByIndex(index) {
        return recordStore().fold(
            error => {
                throw new DatasetError('DS_OPERATION_FAILED', error)
            },
            service => service.removeRecord(index),
        )
    }

    function newRecordAtIndex(atIndex, defaultDraft) {
        return recordStore().fold(
            error => {
                throw new DatasetError('DS_OPERATION_FAILED', error)
            },
            service => service.newRecord(atIndex, defaultDraft),
        )
    }

    function assertComponentsValid(currentRecord) {
        const nonValidComponentAdapterContexts = componentAdapterContexts.filter(
            cac => !isComponentValid(cac, currentRecord),
        )
        nonValidComponentAdapterContexts.forEach(({
                component
            }) =>
            component.updateValidityIndication(),
        )

        if (nonValidComponentAdapterContexts.length) {
            throw new DatasetError(
                'DS_VALIDATION_ERROR',
                'Some of the elements validation failed',
            )
        }
    }

    function sendAutomationEvent(record) {
        return getSchema(datasetCollectionName).fold(
            () => {},
            async schema => {
                try {
                    const supportedNotDeletedSchemaFields = pickBy(
                        schema.fields,
                        (fieldData, fieldName) =>
                        isFieldSupported(fieldData, fieldName) &&
                        !isFieldDeleted(fieldData),
                    )
                    const detailedEventPayload = {
                        'form-id': {
                            value: controllerId,
                            keyName: '',
                        },
                    }
                    forEach(supportedNotDeletedSchemaFields, (fieldData, fieldName) => {
                        const automationsFieldName = generateAutomationsFieldName(
                            controllerId,
                            fieldName,
                        )
                        const {
                            displayName: keyName,
                            index
                        } = fieldData
                        getFieldValueAndTypeIfPossible({
                            record,
                            fieldData,
                            fieldName,
                            getSchema,
                        }).fold(
                            () => {},
                            value => {
                                const {
                                    value: fieldValue,
                                    type: valueType
                                } = value
                                detailedEventPayload[`field:${automationsFieldName}`] = {
                                    value: fieldValue,
                                    keyName,
                                    index,
                                    valueType,
                                }
                            },
                        )
                    })
                    const eventUTCTime = getFieldValue(record, '_updatedDate')
                    await reportFormEventToAutomation({
                        eventUTCTime,
                        detailedEventPayload,
                    })
                } catch (err) {
                    if (err.message.includes('Network request failed')) {
                        logger.info(
                            `automations integration - Network request failed on sendAutomationEvent`,
                        )
                    } else {
                        logger.error(err)
                    }
                }
            },
        )
    }

    function isFieldDeleted(fieldData) {
        return !!fieldData.isDeleted
    }

    function getFieldValueAndTypeIfPossible({
        record,
        fieldData,
        fieldName,
        getSchema,
    }) {
        return fieldData.type === 'reference' ?
            getSchema(fieldData.referencedCollection).map(referenceSchema => {
                const fieldValue = getFieldValue(
                    record[fieldName],
                    referenceSchema.displayField,
                )
                return {
                    value: convertValueToString(fieldValue),
                    type: referenceSchema.fields[referenceSchema.displayField].type,
                }
            }) :
            Maybe.Just({
                value: convertValueToString(getFieldValue(record, fieldName)),
                type: fieldData.type,
            })
    }

    function fireEventByName(eventName, ...payload) {
        return logger.userCodeZone(fireEvent)(eventName, ...payload)
    }

    function notifyIndexChange() {
        return adapterApi().currentIndexChanged()
    }

    function notifyRecordSetLoaded() {
        return Promise.all(adapterApi().recordSetLoaded())
    }

    function updateCurrentView() {
        return Promise.all(adapterApi().currentViewChanged())
    }

    return {
        goToRecordByIndex: (currentIndex, requestedIndex, forceRefreshRecord) => ({
            run: withBreadcrumbsAsync(
                'goToRecordByIndex',
                function goToRecordByIndex() {
                    return recordStore().fold(
                        error => {
                            throw new DatasetError('DS_OPERATION_FAILED', error)
                        },
                        async service => {
                            const totalCount = service.getMatchingRecordCount()
                            const realIndex = Math.max(
                                Math.min(requestedIndex, totalCount - 1),
                                0,
                            )

                            if (currentIndex !== realIndex || forceRefreshRecord) {
                                const queryResult = await service.getRecords(realIndex, 1)

                                return queryResult.matchWith({
                                    Empty: () => recordsActions.GoToIndexResult.NoRecord(),
                                    Results: ({
                                            items
                                        }) =>
                                        recordsActions.GoToIndexResult.Record(realIndex, items[0]),
                                })
                            } else {
                                return recordsActions.GoToIndexResult.InvalidIndex()
                            }
                        },
                    )
                },
            ),
            isQueued: true,
            resultActionCreator: recordsActions.goToRecordByIndexResult,
        }),

        setFieldsInCurrentRecord: (fields, index, source) => ({
            run: withBreadcrumbs(
                'setFieldsInCurrentRecord',
                function setFieldsInCurrentRecord() {
                    const convertedFieldValues = ensureSchemaTypes(getFieldType, fields)

                    return recordStore().fold(
                        error => {
                            throw new DatasetError('DS_OPERATION_FAILED', error)
                        },
                        service =>
                        service.setFieldsValues(index, convertedFieldValues, source).fold(
                            e => {
                                throw e
                            },
                            _ => {},
                        ),
                    )
                },
            ),
            isQueued: false,
        }),

        revertChanges: (index, defaultDraft) => ({
            run: withBreadcrumbs('revertChanges', function revertChanges() {
                recordStore().chain(service => service.resetDraft(index, defaultDraft))

                // This updateComponentsBasedOnRecord is still needed because of upload buttons' behaviour.
                // Upload buttons, when a file is selected, do not update the record data, but still
                // need to be reverted to clear that selection. Therefore, the revert action must always
                // call the adapters' currentRecordModified event.
                updateComponents()
            }),
            isQueued: false,
            resultActionCreator: recordsActions.revertResult,
        }),

        saveRecord: (index, record, isForm) => ({
            run: withBreadcrumbsAsync('saveRecord', async function saveRecord() {
                await executeBeforeSaveHooks(executeHooks)
                return recordStore().fold(
                    () => false,
                    async service => {
                        if (service.hasDraft(index)) {
                            assertComponentsValid(record)

                            const afterSaveRecord = await service.saveRecord(index)
                            fireEventByName('afterSave', record, afterSaveRecord)
                            if (isForm) await sendAutomationEvent(afterSaveRecord)
                            return afterSaveRecord
                        }
                    },
                )
            }),
            isQueued: true,
            resultActionCreator: recordsActions.saveRecordResult,
        }),

        removeCurrentRecord: index => ({
            run: withBreadcrumbsAsync('removeCurrentRecord', () =>
                removeRecordByIndex(index),
            ),
            isQueued: true,
            resultActionCreator: recordsActions.removeCurrentRecordResult,
        }),

        newRecord: (atIndex, defaultDraft) => ({
            run: withBreadcrumbs('newRecord', () =>
                newRecordAtIndex(atIndex, defaultDraft),
            ),
            isQueued: true,
            resultActionCreator: recordsActions.newRecordResult,
        }),

        fireEvent: (eventName, ...payload) => ({
            run: withBreadcrumbs('fireEvent', () =>
                fireEventByName(eventName, ...payload),
            ),
            isQueued: false,
        }),

        notifyIndexChange: toCurrentIndex => ({
            run: withBreadcrumbs('notifyIndexChange', () => {
                notifyIndexChange()
                fireEventByName('currentIndexChanged', toCurrentIndex)
            }),
            isQueued: false,
        }),

        notifyRecordSetLoaded: () => ({
            run: withBreadcrumbsAsync('notifyRecordSetLoaded', notifyRecordSetLoaded),
            isQueued: true,
        }),

        updateCurrentView: actionType => ({
            run: withBreadcrumbsAsync('updateCurrentView', () =>
                updateCurrentView(actionType),
            ),
            isQueued: true,
            resultActionCreator: recordsActions.updateCurrentViewResult,
        }),

        refresh: (index, defaultDraft, isWriteOnly) => ({
            run: withBreadcrumbsAsync('refresh', async function refresh() {
                return recordStore().fold(
                    error => {
                        throw new DatasetError('DS_OPERATION_FAILED', error)
                    },
                    async service => {
                        service.reset()

                        return isWriteOnly ?
                            recordsActions.GoToIndexResult.Record(
                                0,
                                service.newRecord(0, defaultDraft),
                            ) :
                            service.getRecords(0, 1).then(queryResult =>
                                queryResult.matchWith({
                                    Empty: () => recordsActions.GoToIndexResult.NoRecord(),
                                    Results: ({
                                            items
                                        }) =>
                                        recordsActions.GoToIndexResult.Record(0, items[0]),
                                }),
                            )
                    },
                )
            }),
            isQueued: true,
            resultActionCreator: recordsActions.refreshResult,
        }),

        updateComponents: (compIdsToExclude, updatedFields) => ({
            run: withBreadcrumbs('updateComponents', () => {
                updateComponents(compIdsToExclude, updatedFields)
            }),
            isQueued: false,
        }),
    }
}

export default effectsCreator