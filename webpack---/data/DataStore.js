import {
    mergeWith,
    get
} from 'lodash-es'
import {
    mergeReferences
} from './utils'
import {
    FieldType
} from '@wix/wix-data-schema-types'

export default class DataStore {
    getData({
        datasetId,
        collectionId,
        includes
    }) {
        const data = this.#recordsInfoByDataset[datasetId]
        return data ?
            {
                totalCount: data.totalCount,
                items: data.itemIds.map(recordId =>
                    hideIrrelevantRefs(
                        this.#recordsByCollection[collectionId][recordId],
                        this.getSchema(collectionId),
                        includes,
                    ),
                ),
            } :
            null
    }

    getRecord({
        collectionId,
        recordId,
        includes
    }) {
        const record = get(
            this.#recordsByCollection, [collectionId, recordId],
            null,
        )
        if (!record) return getEmptyResponse()
        return hideIrrelevantRefs(
            this.#recordsByCollection[collectionId][recordId],
            this.getSchema(collectionId),
            includes,
        )
    }

    updateCollectionData({
        collectionId,
        data
    }) {
        const {
            [collectionId]: records
        } = this.#recordsByCollection
        const {
            [collectionId]: existingFieldValues
        } =
        this.#uniqueFieldValuesByCollection
        const {
            items,
            uniqueFieldValues
        } = data

        /* copy paste from fes */
        this.#recordsByCollection[collectionId] = mergeItemsToRecords(
            items,
            records,
        )
        this.#uniqueFieldValuesByCollection[collectionId] = mergeUniqueFieldValues(
            uniqueFieldValues,
            existingFieldValues,
        )
    }

    getSchema(collectionId) {
        return this.#schemas[collectionId]
    }

    updateStore({
        recordsByCollection = {},
        recordsInfoByDataset = {},
        uniqueFieldValuesByCollection = {},
    }) {
        this.#recordsInfoByDataset = {
            ...this.#recordsInfoByDataset,
            ...recordsInfoByDataset,
        }

        for (const [collectionId, records] of Object.entries(recordsByCollection)) {
            this.#recordsByCollection[collectionId] = {
                ...this.#recordsByCollection[collectionId],
                ...records,
            }
        }

        for (const [collectionId, uniqueFieldValuesByFieldKey] of Object.entries(
                uniqueFieldValuesByCollection,
            )) {
            this.#uniqueFieldValuesByCollection[collectionId] = {
                ...this.#uniqueFieldValuesByCollection[collectionId],
                ...uniqueFieldValuesByFieldKey,
            }
        }
    }

    getStore() {
        return {
            recordsInfoByDataset: this.#recordsInfoByDataset,
            recordsByCollection: this.#recordsByCollection,
            uniqueFieldValuesByCollection: this.#uniqueFieldValuesByCollection,
        }
    }

    hasDataset(datasetId) {
        return Boolean(this.#recordsInfoByDataset[datasetId])
    }

    setUniqueFieldValues({
        collectionId,
        fieldKey,
        data
    }) {
        this.#uniqueFieldValuesByCollection[collectionId] = {
            ...this.#uniqueFieldValuesByCollection[collectionId],
            [fieldKey]: data,
        }
    }

    getUniqueFieldValues({
        collectionId,
        fieldKey
    }) {
        return this.#uniqueFieldValuesByCollection[collectionId] ? .[fieldKey]
    }

    updateSchemas(schemas) {
        for (const [collectionId, schema] of Object.entries(schemas)) {
            this.#schemas[collectionId] = {
                ...this.#schemas[collectionId],
                ...schema,
            }
        }
    }

    getSchemas() {
        return this.#schemas
    }

    #
    recordsInfoByDataset = {}#
    recordsByCollection = {}#
    uniqueFieldValuesByCollection = {}#
    schemas = {}
}

const isFieldReference = (fieldName, schema) =>
    schema ? .fields ? .[fieldName] ? .type === FieldType.reference //TODO: remove protection when it -> unit tests migration

const isReferenceExcluded = (includes, fieldName) =>
    !includes || !includes.includes(fieldName)

const hideIrrelevantRefs = (record, schema, includes) => {
    return Object.entries(record).reduce((acc, [fieldName, value]) => {
        if (
            isFieldReference(fieldName, schema) &&
            isReferenceExcluded(includes, fieldName) &&
            Boolean(value ? ._id)
        ) {
            acc[fieldName] = value._id
        } else {
            acc[fieldName] = value
        }
        return acc
    }, {})
}

const mergeItemsToRecords = (items, records = {}) =>
    items.reduce((acc, record) => {
        const existingRecord = acc[record._id]
        acc[record._id] = existingRecord ?
            mergeWith(existingRecord, record, mergeReferences) :
            record

        return acc
    }, records)

const mergeUniqueFieldValues = (
    newFieldValues = {},
    existingFieldValues = {},
) => ({
    ...existingFieldValues,
    ...newFieldValues,
})

const getEmptyResponse = () => ({
    totalCount: 0,
    items: [],
})