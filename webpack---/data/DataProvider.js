import Deferred from '../helpers/Deferred'
import {
    traceCreators
} from '../logger'
import DataStore from '../data/DataStore'
import appContext from '../viewer-app-module/DataBindingAppContext'
import {
    getReferencedCollectionIds
} from '../data/utils'

class DataProvider {
    constructor({
        appLogger,
        errorReporter
    }) {
        const {
            dataFetcher
        } = appContext
        this.#dataFetcher = dataFetcher
        this.#dataStore = new DataStore()
        this.#dataFetchingBulk = {}
        this.#bulkDataFetching = Promise.resolve()
        this.errorReporter = errorReporter
        this.appLogger = appLogger
    }

    createBulkRequest(datasetFetchConfigs) {
        this.#dataFetchingBulk = datasetFetchConfigs.reduce(
            (acc, {
                id,
                refresh
            }) =>
            refresh || !this.#dataStore.hasDataset(id) ?
            { ...acc,
                [id]: new Deferred()
            } :
            acc, {},
        )

        const dataRequestingDatasets = Object.entries(this.#dataFetchingBulk).map(
            ([, {
                promise
            }]) => promise,
        )

        this.#bulkDataFetching = this.#waitForDataFetched(
            dataRequestingDatasets,
        ).then(() => (this.#dataFetchingBulk = {}))
    }

    async getDataFromBulk({
        datasetId,
        collectionId,
        filter,
        sort,
        length,
        includes,
        uniqueFieldValues,
    }) {
        if (this.#dataFetchingBulk[datasetId]) {
            // TODO: reject and return cache data if we have it
            this.#dataFetchingBulk[datasetId].resolve({
                datasetId,
                collectionId,
                filter,
                sort,
                offset: 0,
                length,
                includes,
                uniqueFieldValues,
            })

            await this.#bulkDataFetching
        }

        return (
            this.#dataStore.getData({
                datasetId,
                collectionId,
                includes,
            }) ||
            this.getData({
                collectionId,
                filter,
                sort,
                offset: 0,
                length,
                includes,
                uniqueFieldValues,
            })
        )
    }

    async getData({
        collectionId,
        filter,
        sort,
        offset,
        length,
        includes,
        uniqueFieldValues,
    }) {
        const uniqueFieldValuesToFetch = uniqueFieldValues ?
            uniqueFieldValues.filter(
                fieldKey => !this.getUniqueFieldValues({
                    collectionId,
                    fieldKey
                }),
            ) :
            null
        const data = await this.#dataFetcher.fetchData({
            collectionId,
            filter,
            sort,
            offset,
            length,
            includes,
            uniqueFieldValues: uniqueFieldValuesToFetch,
        })

        await this.#schemasLoading
        this.#dataStore.updateCollectionData({
            collectionId,
            data
        })

        return data
    }

    async remove({
        collectionId,
        recordId
    }) {
        return this.#dataFetcher.remove({
            collectionId,
            recordId,
        })
    }

    async save({
        collectionId,
        record,
        includeReferences
    }) {
        return this.#dataFetcher.save({
            collectionId,
            record,
            includeReferences,
        })
    }

    async getSibling(config) {
        return await this.#dataFetcher.getSibling(config)
    }

    async loadSchemas(collectionIds, cachedSchemas = {}) {
        //TODO: it used to be retry policy implemented here with reporting nubers of retries to Sentry
        //TODO: trying without it for now since it seemes redundant.
        //TODO: former error was "Fetching schemas required retries"
        const notCachedCollectionIds = collectionIds.filter(
            collectionId => !cachedSchemas[collectionId],
        )
        this.#schemasLoading = notCachedCollectionIds.length ?
            this.#dataFetcher.fetchSchemas(notCachedCollectionIds) :
            Promise.resolve({})
        const fetchedSchemas = await this.#schemasLoading

        //TODO: removed collection doesn't get its schema
        //TODO: viewer runs us for the first time without routerReturnedData!!

        this.#dataStore.updateSchemas({ ...cachedSchemas,
            ...fetchedSchemas
        })
        return this.#dataStore.getSchemas()
    }

    getRecord({
        collectionId,
        recordId,
        includes
    }) {
        return this.#dataStore.getRecord({
            collectionId,
            recordId,
            includes,
        })
    }

    getSchema(collectionId) {
        return this.#dataStore.getSchema(collectionId)
    }

    hasSchema(collectionId) {
        return Boolean(this.getSchema(collectionId))
    }

    getReferencedSchemas(collectionId) {
        //TODO: getFieldType can be called by userInput resolver with dataset of removed collection
        // for some unknown reason. should be changed to something like
        // if there is no colleciton to filter by, don't filter at all!
        const schema = this.getSchema(collectionId)
        const schemas = this.#dataStore.getSchemas()

        return getReferencedCollectionIds(schema).reduce(
            (acc, collectionId) => ({
                ...acc,
                [collectionId]: schemas[collectionId],
            }), {},
        )
    }

    setCollectionData({
        collectionId,
        data
    }) {
        if (data) {
            this.#dataStore.updateCollectionData({
                collectionId,
                data
            })
        }
    }

    setStore(store) {
        if (store) {
            this.#dataStore.updateStore(store)
        }
    }

    getStore() {
        return this.#dataStore.getStore()
    }

    setUniqueFieldValues({
        collectionId,
        fieldKey,
        data
    }) {
        return this.#dataStore.setUniqueFieldValues({
            collectionId,
            fieldKey,
            data,
        })
    }

    getUniqueFieldValues({
        collectionId,
        fieldKey
    }) {
        return this.#dataStore.getUniqueFieldValues({
            collectionId,
            fieldKey
        })
    }

    createSimpleFilter(key, value) {
        return this.#dataFetcher.createSimpleFilter(key, value)
    }

    #
    dataFetcher# dataStore# dataFetchingBulk# bulkDataFetching# schemasLoading

    async# fetchBulkData(datasetConfigs) {
        const {
            recordsByCollection,
            //TODO: come up with better name for recordsInfoByDataset,
            //TODO: since it is just an ordered array acording to our internal dataset config.
            //TODO: server knows nothing about dataset id.
            recordsInfoByDataset: sortedRecordsInfo,
            uniqueFieldValuesByCollection,
        } = await this.appLogger.traceAsync(
            // TODO: move to proxy!!
            traceCreators.fetchPrimaryInitialData(),
            () => this.#dataFetcher.fetchBulkData(datasetConfigs),
        )

        const recordsInfoByDataset = sortedRecordsInfo.reduce(
            (acc, {
                itemIds = [],
                totalCount = 0,
                error
            }, index) => {
                const {
                    datasetId
                } = datasetConfigs[index]

                if (error) {
                    //TODO: now wixDataProxy wrapper automagically reports an error to sentry.
                    //TODO: after FES migration or change wixDataProxy to normal wixData without any magic
                    //TODO: we will need to send the error to sentry here explicitly
                    this.errorReporter(
                        `Failed to load data for dataset ${datasetId}`,
                        error,
                    )
                }

                acc[datasetId] = {
                    itemIds,
                    totalCount
                }

                return acc
            }, {},
        )

        return {
            recordsByCollection,
            recordsInfoByDataset,
            uniqueFieldValuesByCollection,
        }
    }

    async# waitForDataFetched(dataRequestingDatasets) {
        if (dataRequestingDatasets.length) {
            const datasetConfigs = await Promise.all(dataRequestingDatasets)
            const data = await this.#fetchBulkData(datasetConfigs)
            await this.#schemasLoading

            this.#dataStore.updateStore(data)
        }
    }
}

export default DataProvider