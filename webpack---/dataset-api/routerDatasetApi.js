import {
    mapValues
} from 'lodash-es'
import {
    assertDatasetTypeIsRouter
} from './datasetApiAssertions'

const routerDatasetApiCreator = ({
    datasetType,
    siblingDynamicPageUrlGetter,
}) => {
    const routerDatasetApi = {
        async getNextDynamicPage() {
            return siblingDynamicPageUrlGetter != null ?
                siblingDynamicPageUrlGetter.getNextDynamicPageUrl() :
                null
        },

        async getPreviousDynamicPage() {
            return siblingDynamicPageUrlGetter ?
                siblingDynamicPageUrlGetter.getPreviousDynamicPageUrl() :
                null
        },
    }
    return mapValues(routerDatasetApi, (fn, functionName) => (...args) => {
        assertDatasetTypeIsRouter(datasetType, functionName)
        return fn(...args)
    })
}

export default routerDatasetApiCreator