import * as readWriteModes from '@wix/wix-data-client-common/src/dataset-configuration/readWriteModes'

export const getCollectionName = (datasetConfig = {}) =>
    datasetConfig.collectionName

export const getPageSize = (datasetConfig = {}) => datasetConfig.pageSize

export const isWriteOnly = (datasetConfig = {}) =>
    datasetConfig.readWriteType === readWriteModes.WRITE

export const getReadWriteType = (datasetConfig = {}) =>
    datasetConfig.readWriteType

export default {
    getCollectionName,
    getPageSize,
    isWriteOnly,
    getReadWriteType
}