import actionTypes from './actionTypes'

export const initialize = connections => ({
    type: actionTypes.INITIALIZE,
    connections,
})

export const setNextDynamicPageUrl = url => ({
    type: actionTypes.NEXT_DYNAMIC_PAGE_URL_RESULT,
    url,
})

export const setPreviousDynamicPageUrl = url => ({
    type: actionTypes.PREVIOUS_DYNAMIC_PAGE_URL_RESULT,
    url,
})

export default {
    initialize,
    setNextDynamicPageUrl,
    setPreviousDynamicPageUrl
}