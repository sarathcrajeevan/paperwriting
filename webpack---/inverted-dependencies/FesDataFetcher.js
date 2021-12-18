import {
    convertFromCustomFormat
} from '@wix/cloud-elementory-protocol'

class ServerError {
    constructor({
        message,
        code
    }) {
        const error = new Error(message)

        error.code = code

        return error
    }
}
export default class DataFetcher {
    constructor({
        getRequestParams,
        httpClient
    }) {
        this.getRequestParams = getRequestParams
        this.httpClient = httpClient
    }

    async _makeRequestTo(endpoint, body) {
        const {
            instance,
            gridAppId
        } = this.getRequestParams()

        const response = await this.httpClient.post(
            `/_serverless/data-binding-server/${endpoint}`,
            body, {
                params: {
                    gridAppId,
                },
                headers: {
                    Authorization: instance,
                    'Content-Type': 'application/json',
                },
            },
        )
        return response.data
    }

    async fetchBulkData(datasetConfigs) {
        const {
            recordsByCollection,
            recordsInfoByDataset
        } =
        await this._makeRequestTo('fetch-initial-data', datasetConfigs)

        return {
            recordsInfoByDataset: recordsInfoByDataset.reduce(
                (acc, {
                    itemIds = [],
                    totalCount = 0,
                    error
                }) => [
                    ...acc,
                    {
                        itemIds,
                        totalCount,
                        error: error ? new ServerError(error) : undefined,
                    },
                ], [],
            ),
            recordsByCollection: Object.entries(recordsByCollection).reduce(
                (recordsByCollection, [collectionId, collection]) => ({
                    ...recordsByCollection,
                    [collectionId]: Object.entries(collection).reduce(
                        (records, [recordId, record]) => ({
                            ...records,
                            [recordId]: convertFromCustomFormat(record),
                        }), {},
                    ),
                }), {},
            ),
        }
    }

    async fetchData(requestConfig) {
        const {
            items,
            ...rest
        } = await this._makeRequestTo(
            'fetch-data',
            requestConfig,
        )
        return {
            ...rest,
            items: items.map(item => convertFromCustomFormat(item)),
        }
    }

    async remove(requestConfig) {
        return this._makeRequestTo('remove', requestConfig)
    }

    async save(requestConfig) {
        const {
            item
        } = await this._makeRequestTo('save', requestConfig)
        return convertFromCustomFormat(item)
    }
}