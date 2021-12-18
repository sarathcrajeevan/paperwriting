'use strict'

import {
    traceHandlerIds
} from './loggerWithHandlers'
import {
    TraceType
} from './traceType'

const {
    FEDOPS,
    SYSTEM_TRACING
} = traceHandlerIds

const traceLevels = {
    INFO: 'info',
    WARN: 'warn',
    ERROR: 'error',
}

const initAppForPage = () =>
    TraceType.Action({
        actionName: 'databinding/initAppForPage',
        options: {
            level: traceLevels.INFO,
            reportToHandlers: [FEDOPS, SYSTEM_TRACING],
        },
    })

const createControllers = () =>
    TraceType.Action({
        actionName: 'databinding/createControllers',
        options: {
            level: traceLevels.INFO,
            reportToHandlers: [FEDOPS, SYSTEM_TRACING],
        },
    })

const loadSchemas = () =>
    TraceType.Action({
        actionName: 'databinding/loadSchemas',
        options: {
            level: traceLevels.INFO,
            reportToHandlers: [FEDOPS, SYSTEM_TRACING],
        },
    })

const findRecords = ({
        collectionName,
        filter,
        sort,
        offset,
        length
    }) =>
    TraceType.Action({
        actionName: 'dataset/findRecords',
        options: {
            level: traceLevels.INFO,
            reportToHandlers: [SYSTEM_TRACING],
            data: {
                message: {
                    collectionName,
                    filter,
                    sort,
                    offset,
                    length,
                },
            },
        },
    })

const pageReady = () =>
    TraceType.Action({
        actionName: 'dataset/pageReady',
        options: {
            level: traceLevels.INFO,
            reportToHandlers: [FEDOPS, SYSTEM_TRACING],
        },
    })
const pageReadyGetData = () =>
    TraceType.Action({
        actionName: 'dataset/pageReady/getData',
        options: {
            level: traceLevels.INFO,
            reportToHandlers: [FEDOPS, SYSTEM_TRACING],
        },
    })

const fetchPrimaryInitialData = () =>
    TraceType.Action({
        actionName: 'dataset/fetchPrimaryInitialData',
        options: {
            level: traceLevels.INFO,
            reportToHandlers: [FEDOPS, SYSTEM_TRACING],
        },
    })

const repeaterItemReady = index =>
    TraceType.Action({
        actionName: `connectedRepeaterAdapter itemReady ${index}`,
        options: {
            level: traceLevels.INFO,
            reportToHandlers: [SYSTEM_TRACING]
        },
    })

const repeaterSetData = () =>
    TraceType.Action({
        actionName: 'connectedRepeaterAdapter setting repeater.data',
        options: {
            level: traceLevels.INFO,
            reportToHandlers: [SYSTEM_TRACING]
        },
    })

const repeaterRecordSetLoaded = () =>
    TraceType.Action({
        actionName: `connectedRepeaterAdapter recordSetLoaded`,
        options: {
            level: traceLevels.INFO,
            reportToHandlers: [SYSTEM_TRACING]
        },
    })

const repeaterCurrentViewChanged = () =>
    TraceType.Action({
        actionName: `connectedRepeaterAdapter currentViewChanged`,
        options: {
            level: traceLevels.INFO,
            reportToHandlers: [SYSTEM_TRACING]
        },
    })

export default {
    initAppForPage,
    createControllers,
    findRecords,
    loadSchemas,
    pageReady,
    pageReadyGetData,
    repeaterItemReady,
    repeaterSetData,
    repeaterRecordSetLoaded,
    repeaterCurrentViewChanged,
    fetchPrimaryInitialData,
}