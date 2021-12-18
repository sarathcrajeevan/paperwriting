'use strict'

import {
    uniqBy
} from 'lodash-es'

import {
    FILTER_INPUT_ROLE,
    GRID_ROLE,
    DROPDOWN_OPTIONS_ROLE,
    GALLERY_ROLE,
    UPLOAD_BUTTON_ROLE,
    DETAILS_DATASET_ROLE,
    REPEATER_ROLE,
    PAGINATION_ROLE,
    DETAILS_REPEATER_ROLE,
    GOOGLEMAP_ROLE,
    SELECTION_TAGS_OPTIONS_ROLE,
} from '@wix/wix-data-client-common/src/connection-config/roles'

import isInputComponent from '../helpers/isInputComponent'
import {
    createAdapterContext
} from './context'
import {
    getScopeType,
    SCOPE_TYPES
} from './scopeTypes'
import {
    findContainer
} from './findContainers'
import defaultAdapter from './adapters/defaultAdapter'
import inputAdapter from './adapters/inputAdapter'
import gridAdapter from './adapters/gridAdapter'
import dropdownOptionsAdapter from './adapters/dropdownOptionsAdapter'
import selectionTagsOptionsAdapter from './adapters/selectionTagsOptionsAdapter'
import galleryAdapter from './adapters/galleryAdapter'
import uploadButtonAdapter from './adapters/uploadButtonAdapter'
import nullAdapter from './adapters/nullAdapter'
import connectedRepeaterAdapter from './adapters/connectedRepeaterAdapter'
import detailsRepeaterAdapter from './adapters/detailsRepeaterAdapter'
import paginationAdapter from './adapters/paginationAdapter'
import googleMapAdapter from './adapters/googleMapAdapter'
import filterInputAdapter from './adapters/filterInputAdapter'

const rolesToApiCreators = {
    [GRID_ROLE]: gridAdapter,
    [DROPDOWN_OPTIONS_ROLE]: dropdownOptionsAdapter,
    [GALLERY_ROLE]: galleryAdapter,
    [UPLOAD_BUTTON_ROLE]: uploadButtonAdapter,
    [DETAILS_DATASET_ROLE]: nullAdapter,
    [REPEATER_ROLE]: connectedRepeaterAdapter,
    [PAGINATION_ROLE]: paginationAdapter,
    [DETAILS_REPEATER_ROLE]: detailsRepeaterAdapter,
    [FILTER_INPUT_ROLE]: filterInputAdapter,
    [GOOGLEMAP_ROLE]: googleMapAdapter,
    [SELECTION_TAGS_OPTIONS_ROLE]: selectionTagsOptionsAdapter,
}

const getAdapterApiCreator = (role, componentIsInput) =>
    rolesToApiCreators[role] ||
    (componentIsInput && inputAdapter) ||
    defaultAdapter

const createComponentAdapter = ({
    role,
    adapterParams,
    component
}) => {
    const adapterApiCreator = getAdapterApiCreator(
        role,
        isInputComponent(component),
    )
    return adapterApiCreator(adapterParams)
}

const createComponentAdapterContexts = ({
    connectedComponents,
    adapterApi,
    getFieldType,
    ignoreItemsInRepeater,
    $w,
    dependencies,
    adapterParams,
}) => {
    const cacs = []

    connectedComponents.forEach(({
        component,
        role,
        compId
    }) => {
        if (ignoreItemsInRepeater) {
            const isComponentInsidePrimaryOrDetailsRepeater = findContainer(component)
                .map(container =>
                    getScopeType(container.uniqueId, dependencies, connectedComponents),
                )
                .map(
                    scopeType =>
                    scopeType === SCOPE_TYPES.PRIMARY ||
                    scopeType === SCOPE_TYPES.DETAILS,
                )
                .getOrElse(false)

            if (isComponentInsidePrimaryOrDetailsRepeater) {
                return
            }
        }

        const adapterContext = createAdapterContext({
            getFieldType,
            role,
            compId,
            component,
            $w,
            api: createComponentAdapter({
                role,
                adapterParams,
                component
            }),
        })

        if (adapterApi().isValidContext(adapterContext)) {
            cacs.push(adapterContext)
        }
    })

    return cacs
}

const createDetailsRepeatersAdapterContexts = (
    connectedComponents,
    getFieldType,
    dependencies,
    adapterParams,
) => {
    const detailsRepeaters = []

    connectedComponents.forEach(({
        component
    }) => {
        findContainer(component).chain(container => {
            const scopeType = getScopeType(
                container.uniqueId,
                dependencies,
                connectedComponents,
            )
            if (scopeType === SCOPE_TYPES.DETAILS) {
                detailsRepeaters.push(container)
            }
        })
    })

    const uniqDetailsRepeaters = uniqBy(detailsRepeaters, 'uniqueId')
    return uniqDetailsRepeaters.map(component =>
        createAdapterContext({
            getFieldType,
            role: DETAILS_REPEATER_ROLE,
            component,
            compId: component.uniqueId,
            api: createComponentAdapter({
                role: DETAILS_REPEATER_ROLE,
                adapterParams,
                component,
            }),
        }),
    )
}

export {
    createComponentAdapterContexts,
    createDetailsRepeatersAdapterContexts
}