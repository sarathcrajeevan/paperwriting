'use strict'

import {
    get
} from 'lodash-es'
import actionTypes from './actionTypes'
import DynamicPageUrlLoadState from './DynamicPageUrlLoadState'

const initialDynamicPagesState = {
    nextDynamicPageUrl: DynamicPageUrlLoadState.Empty(),
    previousDynamicPageUrl: DynamicPageUrlLoadState.Empty(),
}

// uniqueOnClickActionsFromConnections :: (Array) -> Set
const uniqueOnClickActionsFromConnections = connections => {
    const onClickConnectedComponents = connections.filter(
        c => !!get(c, 'config.events.onClick.action'),
    )
    return new Set(
        onClickConnectedComponents.map(connection => {
            return get(connection, 'config.events.onClick.action')
        }),
    )
}

const getUrlFetchingState = connections => {
    const uniqueActions = uniqueOnClickActionsFromConnections(connections)
    const getUrlState = shouldLoad =>
        shouldLoad ?
        DynamicPageUrlLoadState.Loading() :
        DynamicPageUrlLoadState.Empty()

    return {
        nextDynamicPageUrl: getUrlState(uniqueActions.has('nextDynamicPage')),
        previousDynamicPageUrl: getUrlState(
            uniqueActions.has('previousDynamicPage'),
        ),
    }
}

const reducer = (state = initialDynamicPagesState, action) => {
    switch (action.type) {
        case actionTypes.INITIALIZE:
            return {
                ...state,
                ...getUrlFetchingState(action.connections),
            }

        case actionTypes.NEXT_DYNAMIC_PAGE_URL_RESULT:
            {
                return {
                    ...state,
                    nextDynamicPageUrl: DynamicPageUrlLoadState.fromUrl(action.payload),
                }
            }

        case actionTypes.PREVIOUS_DYNAMIC_PAGE_URL_RESULT:
            {
                return {
                    ...state,
                    previousDynamicPageUrl: DynamicPageUrlLoadState.fromUrl(action.payload),
                }
            }

        default:
            return state
    }
}

export const selectNextDynamicPageUrl = state => state.nextDynamicPageUrl
export const selectPreviousDynamicPageUrl = state =>
    state.previousDynamicPageUrl

export default {
    reducer,
    selectNextDynamicPageUrl,
    selectPreviousDynamicPageUrl,
}