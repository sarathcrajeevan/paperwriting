'use strict'

export const actionTypes = {
    INIT: 'INIT',
    SET_PAGINATION_DATA: 'SET_PAGINATION_DATA',
}

export const setPaginationData = paginationData => ({
    type: actionTypes.SET_PAGINATION_DATA,
    paginationData,
})

export const init = ({
    controllerConfig = {},
    connections = [],
    isScoped = false,
    datasetType,
}) => ({
    type: actionTypes.INIT,
    datasetConfig: controllerConfig.dataset || {},
    connections,
    isScoped,
    datasetType,
})

export default {
    actionTypes,
    init,
    setPaginationData
}