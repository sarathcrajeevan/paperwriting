import {
    flatten
} from 'lodash-es'
import actionTypes from './actionTypes'
import {
    selectNextDynamicPageUrl,
    selectPreviousDynamicPageUrl,
} from '../dataset-controller/rootReducer'

const shouldLoadNextDynamicPageUrl = state => {
    return selectNextDynamicPageUrl(state).shouldLoadUrl()
}

const shouldLoadPreviousDynamicPageUrl = state => {
    return selectPreviousDynamicPageUrl(state).shouldLoadUrl()
}

const subscriber = ({
    getNextDynamicPageUrl,
    getPreviousDynamicPageUrl
}) => {
    const getNextDynamicPage = {
        run: getNextDynamicPageUrl,
        isQueued: true,
        resultActionCreator: (error, payload) => ({
            type: actionTypes.NEXT_DYNAMIC_PAGE_URL_RESULT,
            error,
            payload,
        }),
    }

    const getPreviousDynamicPage = {
        run: getPreviousDynamicPageUrl,
        isQueued: true,
        resultActionCreator: (error, payload) => ({
            type: actionTypes.PREVIOUS_DYNAMIC_PAGE_URL_RESULT,
            error,
            payload,
        }),
    }

    const processDynamicPagesStates = ({
        hasChangedToTrue
    }) => {
        const effectsToReturn = []

        if (hasChangedToTrue(shouldLoadNextDynamicPageUrl)) {
            effectsToReturn.push(getNextDynamicPage)
        }
        if (hasChangedToTrue(shouldLoadPreviousDynamicPageUrl)) {
            effectsToReturn.push(getPreviousDynamicPage)
        }

        return effectsToReturn
    }

    return transition =>
        flatten([processDynamicPagesStates].map(fn => fn(transition)))
}

export default subscriber