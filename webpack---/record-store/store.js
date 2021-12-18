'use strict'

import {
    flow,
    curry,
    mapValues
} from 'lodash-es'
import {
    assign,
    bind
} from './utils'
import {
    freshCollection,
    fromWarmupCollection
} from './collections'

const freshStore = mainCollectionName => ({
    [mainCollectionName]: {
        ...freshCollection(),
    },
})

const fromWarmupStore = warmupStore => {
    return mapValues(warmupStore, fromWarmupCollection)
}

const setCollection = curry((name, collection) =>
    assign({
        [name]: collection
    }),
)

const getCollection = collectionName => store => store[collectionName]

const updateCollection = (collectionName, updateFn) =>
    bind(
        flow(getCollection(collectionName), updateFn),
        setCollection(collectionName),
    )

const curriedUpdateCollection = curry(updateCollection)

export {
    freshStore,
    fromWarmupStore,
    getCollection,
    setCollection,
    curriedUpdateCollection as updateCollection,
}