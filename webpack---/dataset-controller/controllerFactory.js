'use strict'

import {
    cloneDeep,
    noop
} from 'lodash-es'
import createControllerStore from '../dataset-controller/controllerStore'
import initCreateDataset from '../dataset-controller/controller'

const addScopeToAllHandshakes = (handshakes, {
    compId,
    itemId
}) => {
    if (handshakes) {
        return handshakes.map(handshake => ({
            ...handshake,
            controllerApi: handshake.controllerApi.inScope(compId, itemId),
        }))
    }
}

const createScopedDatasetId = (datasetId, {
    compId,
    itemId
}) => [datasetId, 'componentId', compId, 'itemId', itemId].join('_')

const controllerFactory = (logger, datasetParams) => {
    const controllerStore = createControllerStore(logger)
    const factory = {
        createPrimaryController: () => primaryController,

        createDetailsController: ({
                scopeInfo,
                scoped$w
            }) =>
            createDataset(true, false, {
                ...datasetParams,
                firePlatformEvent: noop,
                datasetId: createScopedDatasetId(datasetParams.datasetId, scopeInfo),
                handshakes: addScopeToAllHandshakes(
                    datasetParams.handshakes,
                    scopeInfo,
                ),
                $w: scoped$w,
            }),

        createFixedItemController: ({
            scopeInfo,
            fixedItem,
            parentId,
            scoped$w,
        }) => {
            const {
                dataProvider,
                controllerConfig,
                dynamicPagesData
            } = datasetParams
            const newControllerConfig = cloneDeep(controllerConfig)
            const fixedData = {
                items: [fixedItem],
                totalCount: 1
            }
            newControllerConfig.dataset.filter = dataProvider.createSimpleFilter(
                '_id',
                fixedItem._id,
            )

            // TODO: case for repeater whose data is set via userCode. We should everything only via datasetAPI
            const {
                collectionName: collectionId
            } = controllerConfig.dataset
            dataProvider.setCollectionData({
                collectionId,
                data: fixedData
            })

            return createDataset(true, true, {
                ...datasetParams,
                controllerConfig: newControllerConfig,
                firePlatformEvent: noop,
                dynamicPagesData,
                datasetId: createScopedDatasetId(datasetParams.datasetId, scopeInfo),
                fixedRecordId: scopeInfo.itemId,
                parentId,
                $w: scoped$w,
            })
        },
    }
    const createDataset = initCreateDataset(factory, controllerStore)
    const primaryController = createDataset(false, false, datasetParams)

    return factory
}

export default controllerFactory