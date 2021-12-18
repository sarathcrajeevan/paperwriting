import {
    constructUrl
} from '../helpers/urlUtils'

const ASCENDING = 'asc'
const DESCENDING = 'desc'

const getSiblingPage = async ({
    dataProvider,
    collectionName,
    directionTowardSibling,
    useLowerCaseDynamicPageUrl,
    dynamicPagesData: {
        dynamicUrl,
        userDefinedFilter,
        dynamicUrlPatternFieldsValues,
        sort,
        sortFields,
        patternFields,
    } = {},
}) => {
    if (dynamicUrl == null || !patternFields.length) {
        return null
    }
    const item = await dataProvider.getSibling({
        collectionName,
        sort,
        sortFields,
        directionTowardSibling,
        fieldValues: dynamicUrlPatternFieldsValues,
        filter: userDefinedFilter,
    })

    return item && constructUrl(item, dynamicUrl, useLowerCaseDynamicPageUrl)
}

export default ({
    dataProvider,
    dynamicPagesData,
    collectionName,
    useLowerCaseDynamicPageUrl,
}) => ({
    getNextDynamicPageUrl: () =>
        getSiblingPage({
            dataProvider,
            dynamicPagesData,
            collectionName,
            directionTowardSibling: ASCENDING,
            useLowerCaseDynamicPageUrl,
        }),
    getPreviousDynamicPageUrl: () =>
        getSiblingPage({
            dataProvider,
            dynamicPagesData,
            collectionName,
            directionTowardSibling: DESCENDING,
            useLowerCaseDynamicPageUrl,
        }),
})