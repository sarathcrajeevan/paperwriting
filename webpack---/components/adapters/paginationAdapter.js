'use strict'
import {
    addComponentEventListener
} from './helpers'
import baseAdapter from './baseAdapter'
import {
    getPaginationData as getPage,
    getCurrentPage,
    getTotalPageCount,
} from '../../dataset-controller/rootReducer'

export default ({
    getState,
    applicationCodeZone,
    databindingVerboseReporter,
}) => {
    const beginningOfPage = (pageNumber, pageSize) => pageSize * (pageNumber - 1)

    const refreshView = ({
        component: pagination
    }, actions) => {
        const currentPage = getCurrentPage(getState())
        const totalPages = getTotalPageCount(
            getState(),
            actions.getTotalItemsCount(),
        )
        pagination.currentPage = currentPage

        if (totalPages < 1) {
            pagination.disable()
        } else {
            pagination.enable()
            pagination.totalPages = totalPages
        }
    }

    return {
        ...baseAdapter,

        // Initial setting of values + binding the event handler
        bindToComponent({
            component
        }, actions) {
            addComponentEventListener(
                component,
                'onChange',
                event => {
                    const requestedPage = event.target.currentPage
                    const page = getPage(getState())
                    const totalPages = getTotalPageCount(
                        getState(),
                        actions.getTotalItemsCount(),
                    )

                    if (requestedPage < 1) {
                        actions.setCurrentIndex(0)
                    } else if (requestedPage > totalPages) {
                        actions.setCurrentIndex(beginningOfPage(totalPages, page.size))
                    } else {
                        actions.setCurrentIndex(beginningOfPage(requestedPage, page.size))
                    }
                },
                applicationCodeZone,
            )

            databindingVerboseReporter.logBinding({
                component,
            })
        },

        // These are both important -> don't need to set handler again, but need to
        // re-set values
        recordSetLoaded: refreshView,

        currentViewChanged: refreshView,
    }
}