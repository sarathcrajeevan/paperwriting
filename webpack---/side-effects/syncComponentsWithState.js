'use strict'

import {
    includes,
    get,
    uniqBy,
    noop
} from 'lodash-es'
import {
    TraceType
} from '../logger/traceType'
import {
    isDatasetReady,
    hasCurrentRecord,
    selectCurrentRecordIndex,
    isReadOnly,
    isEditable,
    getPaginationData,
    selectNextDynamicPageUrl,
    selectPreviousDynamicPageUrl,
} from '../dataset-controller/rootReducer'
import createBreadcrumbMessage from '../helpers/createBreadcrumbMessage'
import isInputComponent from '../helpers/isInputComponent'
import {
    DROPDOWN_OPTIONS_ROLE,
    FILTER_INPUT_ROLE,
    BUTTON_ROLE,
    ICON_BUTTON_ROLE,
    STYLABLE_BUTTON_ROLE,
    SELECTION_TAGS_OPTIONS_ROLE,
} from '@wix/wix-data-client-common/src/connection-config/roles'

const LINKABLE_DISABLEABLE_COMPONENTS = [
    BUTTON_ROLE,
    ICON_BUTTON_ROLE,
    STYLABLE_BUTTON_ROLE,
]

const undisabableRoles = [
    DROPDOWN_OPTIONS_ROLE,
    FILTER_INPUT_ROLE,
    SELECTION_TAGS_OPTIONS_ROLE,
]

const getDisableableInputCacs = cacs =>
    cacs.filter(
        ({
            role,
            component
        }) =>
        !undisabableRoles.includes(role) && isInputComponent(component),
    )

const getDisableableLinkedCacs = (cacs, disableableActions) =>
    cacs
    .filter(({
        role
    }) => includes(LINKABLE_DISABLEABLE_COMPONENTS, role))
    .filter(({
            connectionConfig
        }) =>
        includes(
            disableableActions,
            get(connectionConfig, 'events.onClick.action'),
        ),
    )

const getDisableableComponents = (cacs, disableableActions) => {
    const uniqueDisableableComponentContexts = uniqBy(
        cacs.filter(({
            component
        }) => component.enabled),
        ({
            compId
        }) => compId,
    )

    return {
        inputCacs: getDisableableInputCacs(uniqueDisableableComponentContexts),
        linkedCacs: getDisableableLinkedCacs(
            uniqueDisableableComponentContexts,
            disableableActions,
        ),
    }
}

const updateComponentEnabledState = (
    comp,
    compId,
    shouldBeEnabled,
    logger,
    datasetId,
) => {
    if (comp.enabled !== shouldBeEnabled) {
        shouldBeEnabled ? comp.enable() : comp.disable()
        logger.trace(
            TraceType.Breadcrumb({
                category: 'components',
                message: createBreadcrumbMessage(
                    `${compId} changed to ${shouldBeEnabled ? 'enabled' : 'disabled'}`,
                    datasetId,
                ),
            }),
        )
    }
}

const getSyncComponentsWithStateSubscriber =
    ({
        getState,
        inputCacs,
        linkedCacs,
        datasetId,
        logger,
        shouldEnableLinkedComponent,
    }) =>
    () => {
        const state = getState()
        if (!isDatasetReady(state)) {
            return
        }

        const shouldInputComponentsBeEnabled = isEditable(state)
        inputCacs.forEach(({
            component,
            compId
        }) => {
            updateComponentEnabledState(
                component,
                compId,
                shouldInputComponentsBeEnabled,
                logger,
                datasetId,
            )
        })

        linkedCacs.forEach(({
            component,
            compId
        }) => {
            const action = component.connectionConfig.events.onClick.action
            const shouldBeEnabled = shouldEnableLinkedComponent(action, state)
            updateComponentEnabledState(
                component,
                compId,
                shouldBeEnabled,
                logger,
                datasetId,
            )
        })
    }

const syncEnabledStateForComponentsNotDisabledByUser = ({
        getState,
        subscribe
    },
    componentAdapterContexts,
    logger,
    datasetId,
    recordStore,
) => {
    const getMatchingRecordCount = () =>
        recordStore().fold(
            () => 0,
            service => service.getMatchingRecordCount(),
        )

    const hasNextRecord = state =>
        hasCurrentRecord(state) &&
        selectCurrentRecordIndex(state) < getMatchingRecordCount() - 1

    const hasPreviousRecord = state =>
        hasCurrentRecord(state) && selectCurrentRecordIndex(state) > 0

    const hasPreviousPage = state => getPaginationData(state).offset > 0

    const hasNextPage = state => {
        const {
            offset,
            size,
            numPagesToShow
        } = getPaginationData(state)
        return size * numPagesToShow + offset < getMatchingRecordCount()
    }

    const shouldEnableLinkedComponent = (action, state) =>
        shouldEnableByAction[action](state)
    const shouldEnableByAction = {
        new: state => !isReadOnly(state),
        save: isEditable,
        revert: isEditable,
        remove: isEditable,
        next: hasNextRecord,
        previous: hasPreviousRecord,
        nextPage: hasNextPage,
        previousPage: hasPreviousPage,
        nextDynamicPage: state => selectNextDynamicPageUrl(state).hasUrl(),
        previousDynamicPage: state => selectPreviousDynamicPageUrl(state).hasUrl(),
        loadMore: hasNextPage,
    }

    const disableableActions = Object.keys(shouldEnableByAction)

    const {
        inputCacs,
        linkedCacs
    } = getDisableableComponents(
        componentAdapterContexts,
        disableableActions,
    )

    const quantityOfDisableableComponents = inputCacs.length + linkedCacs.length

    const unsubscribe = quantityOfDisableableComponents ?
        subscribe(
            getSyncComponentsWithStateSubscriber({
                getState,
                inputCacs,
                linkedCacs,
                datasetId,
                logger,
                shouldEnableLinkedComponent,
            }),
        ) :
        noop

    return unsubscribe
}

export default (
    store,
    componentAdapterContexts,
    logger,
    datasetId,
    recordStore,
) => {
    return syncEnabledStateForComponentsNotDisabledByUser(
        store,
        componentAdapterContexts,
        logger,
        datasetId,
        recordStore,
    )
}