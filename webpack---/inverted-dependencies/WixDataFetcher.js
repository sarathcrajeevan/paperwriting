import {
    mergeWith,
    range,
    flow
} from 'lodash-es'
import {
    mergeReferences
} from '../data/utils'

export default class DataFetcher {
    constructor({
        wixData,
        wixDataSchemas,
        wixDataCodeZone
    }) {
        this.#wixData = wixDataFunctions.reduce(
            (acc, fName) => {
                acc[fName] = wixDataCodeZone((...args) => {
                    const result = wixData[fName](...args)

                    return result.catch instanceof Function ?
                        result.catch(e => {
                            //TODO: wixData can return just string as error... oj-vej...
                            //TODO: in this case the error is considered as a user error.
                            //TODO: make special type for this error and extract its message on datasetApi side
                            throw typeof e === 'string' ? e : new FixedWixDataError(e)
                        }) :
                        result
                })

                return acc
            }, { ...wixData
            },
        )

        this.#wixDataSchemas = wixDataSchemasFunctions.reduce(
            (acc, fName) => {
                acc[fName] = wixDataCodeZone((...args) =>
                    wixDataSchemas[fName](...args),
                )

                return acc
            }, { ...wixDataSchemas
            },
        )
    }

    async fetchBulkData(datasetConfigs) {
        const datasetsData = await Promise.all(
            datasetConfigs.map(
                ({
                    collectionId,
                    filter,
                    sort,
                    offset,
                    length,
                    includes,
                    uniqueFieldValues,
                }) =>
                this.fetchData({
                    collectionId,
                    filter,
                    sort,
                    offset,
                    length,
                    includes,
                    uniqueFieldValues,
                }).catch(e => ({
                    error: e
                })),
            ),
        )

        return this.#aggregateData(datasetConfigs, datasetsData)
    }

    async fetchData({
        collectionId,
        filter,
        sort,
        offset,
        length,
        includes,
        uniqueFieldValues,
    }) {
        const [data, uniqueFieldValuesResponse] = await Promise.all([
            this.#wixData.find(
                collectionId,
                filter,
                sort,
                offset,
                length,
                undefined,
                includes,
            ),
            uniqueFieldValues ?
            this.#fetchUniqueValues({
                collectionId,
                fieldKeys: uniqueFieldValues,
            }) :
            {},
        ])

        return {
            ...data,
            uniqueFieldValues: uniqueFieldValuesResponse,
        }
    }

    async remove({
        collectionId,
        recordId
    }) {
        return this.#wixData.remove(collectionId, recordId)
    }

    async save({
        collectionId,
        record,
        includeReferences
    }) {
        return this.#wixData.save(collectionId, record, {
            includeReferences
        })
    }

    //TODO: this is getting sibling for dynamic pages
    //TODO: now it's super tricky. the whole coneption should be revised
    async getSibling({
        collectionName,
        filter,
        sort,
        fieldValues,
        sortFields,
        directionTowardSibling,
    }) {
        const baseQuery = this.#wixData.query(collectionName).setFilterModel(filter)

        const {
            items: [item],
        } = await getSiblingItemQuery({
            sort,
            sortFields,
            fieldValues,
            baseQuery,
            directionTowardSibling,
        }).find()

        return item
    }

    fetchSchemas(collectionIds) {
        return this.#wixDataSchemas.bulkGet(collectionIds, {
            referencedCollectionsDepth: 1,
        })
    }

    //TODO: we're not sure how is better to invert filter/sort builders.
    //TODO: this is the only one for now used for fixed (virtual) controller
    //TODO: this is subject to change!
    createSimpleFilter(key, value) {
        return this.#wixData.filter().eq(key, value).getFilterModel()
    }

    #
    wixData# wixDataSchemas

    # aggregateData(datasetConfigs, datasetsData) {
        return datasetsData.reduce(
            (response, {
                items,
                totalCount,
                uniqueFieldValues,
                error
            }, index) => {
                if (error) {
                    response.recordsInfoByDataset.push({
                        error
                    })
                    return response
                }
                response.recordsInfoByDataset.push({
                    itemIds: items.map(({
                        _id
                    }) => _id),
                    totalCount,
                })
                const collectionId = datasetConfigs[index].collectionId
                response.recordsByCollection[collectionId] = items.reduce(
                    (acc, record) => {
                        const existingRecord = acc[record._id]
                        acc[record._id] = mergeWith(existingRecord, record, mergeReferences)

                        return acc
                    },
                    response.recordsByCollection[collectionId] || {},
                )

                response.uniqueFieldValuesByCollection[collectionId] = {
                    ...response.uniqueFieldValuesByCollection[collectionId],
                    ...uniqueFieldValues,
                }

                return response
            }, {
                recordsInfoByDataset: [],
                recordsByCollection: {},
                uniqueFieldValuesByCollection: {},
            },
        )
    }

    async# fetchUniqueValues({
        collectionId,
        fieldKeys
    }) {
        const uniqueValuesArray = await Promise.all(
            fieldKeys.map(fieldKey =>
                this.#wixData.query(collectionId).distinct(fieldKey),
            ),
        )
        return uniqueValuesArray.reduce((acc, {
            _items: values
        }, index) => {
            acc[fieldKeys[index]] = values
            return acc
        }, {})
    }
}

const wixDataFunctions = ['save', 'remove', 'find', 'filter', 'query']
const wixDataSchemasFunctions = ['list', 'bulkGet']

const getSiblingItemQuery = ({
    sort,
    sortFields,
    directionTowardSibling,
    fieldValues,
    baseQuery,
}) => {
    const buildSiblingQuery = createSiblingQueryBuilder({
        sort,
        sortFields,
        directionTowardSibling,
        fieldValues,
        baseQuery,
    })

    return buildSiblingQuery(sortFields.length - 1).reduce((baseQuery, query) =>
        baseQuery.or(query),
    )
}

const createSiblingQueryBuilder = ({
        baseQuery,
        sortFields,
        sort,
        directionTowardSibling,
        fieldValues,
    }) =>
    function buildSiblingQuery(sortFieldIndex) {
        if (sortFieldIndex === -1) return []

        const sortField = sortFields[sortFieldIndex]

        const query = flow(
            addSorting(sort, directionTowardSibling),
            setDirection(
                sort[sortField],
                directionTowardSibling,
                sortField,
                fieldValues[sortField],
            ),
            setLimit(sortFieldIndex, sortFields, fieldValues),
        )(baseQuery)

        return [query, ...buildSiblingQuery(sortFieldIndex - 1)]
    }

const addSorting = (sort, directionTowardSibling) => query =>
    Object.entries(sort).reduce(
        (query, [field, direction]) =>
        direction === directionTowardSibling ?
        query.ascending(field) :
        query.descending(field),
        query,
    )

const setDirection =
    (sortDirection, directionTowardSibling, sortField, fieldValue) => query =>
    sortDirection === directionTowardSibling ?
    query.gt(sortField, fieldValue) :
    query.lt(sortField, fieldValue)

const setLimit = (sortFieldIndex, sortFields, fieldsValues) => query =>
    range(sortFieldIndex)
    .reduce(
        // I have no idea what is that and why it's needed
        (query, i) => query.eq(sortFields[i], fieldsValues[sortFields[i]]),
        query,
    )
    .limit(1)

class FixedWixDataError {
    constructor(e) {
        // WixData lib creates an error with broken prototype (empty stack).
        // Such errors don't show any message making it imposible to understand the reason.
        if (!e.stack) {
            const {
                message,
                code
            } = e
            const error = new Error(message)
            error.code = code

            return error
        }

        return e
    }
}