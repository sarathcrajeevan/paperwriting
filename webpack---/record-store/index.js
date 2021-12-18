'use strict'

import {
    get
} from 'lodash-es'
import {
    Result
} from '@wix/wix-code-adt'
import {
    getFieldReferencedCollection
} from '../data/utils'
import {
    isSameRecord
} from './records'
import recordStoreServiceCreator from './service'

const createRecordStoreService = ({
    primaryDatasetId,
    recordStoreCache,
    refreshStoreCache,
    dataProvider,
    warmupStore,
    controllerConfig,
    logger,
}) => {
    const datasetConfig = Result.fromNullable(
        controllerConfig,
        'missing controller configuration',
    ).chain(({
            dataset
        }) =>
        Result.fromNullable(
            dataset,
            'controller configuration is missing dataset object',
        ),
    )
    const collectionName = datasetConfig.chain(({
            collectionName
        }) =>
        Result.fromNullable(
            collectionName,
            'dataset is not connected to a collection',
        ),
    )

    return collectionName.map(mainCollectionName => {
        const includes = get(controllerConfig, ['dataset', 'includes'])
        const readWriteType = get(controllerConfig, ['dataset', 'readWriteType'])
        const uniqueFieldValues = get(controllerConfig, [
            'dataset',
            'uniqueFieldValues',
        ])

        return recordStoreServiceCreator({
            primaryDatasetId,
            recordStoreCache,
            refreshStoreCache,
            warmupStore,
            dataProvider,
            mainCollectionName,
            includes,
            uniqueFieldValues,
            readWriteType,
            logger,
        })
    })
}

const createRecordStoreInstance = ({
    recordStoreService,
    getFilter,
    getSort,
    getPageSize,
    prefetchedData,
    datasetId,
    filterResolver,
    getSchema,
    shouldAllowWixDataAccess,
    fixedRecordId,
}) => {
    return byRefField => {
        const pageSize = getPageSize()
        const allowWixDataAccess = shouldAllowWixDataAccess()

        return recordStoreService.chain(service => {
            if (byRefField) {
                return Result.fromMaybe(
                    getSchema().map(schema =>
                        getFieldReferencedCollection(byRefField, schema),
                    ),
                    `cannot resolve referenced collection name for field ${byRefField}`,
                ).map(referencedCollectionName => {
                    return service({
                        pageSize,
                        sort: null,
                        filter: null,
                        allowWixDataAccess,
                        datasetId,
                        referencedCollectionName,
                        fixedRecordId,
                    })
                })
            } else {
                const unresolvedFilter = getFilter()

                return Result.fromMaybe(
                    filterResolver(unresolvedFilter).map(filter =>
                        service({
                            pageSize,
                            sort: getSort(),
                            filter,
                            allowWixDataAccess,
                            datasetId,
                            referencedCollectionName: null,
                            fixedRecordId,
                        }),
                    ),
                    'could not resolve dynamic filter',
                )
            }
        })
    }
}

export {
    isSameRecord,
    createRecordStoreService,
    createRecordStoreInstance
}