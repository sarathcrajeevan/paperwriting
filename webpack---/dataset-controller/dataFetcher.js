'use strict'

import {
    Maybe
} from '@wix/wix-code-adt'
import seedDataFetcher from './seed'
import Deferred from '../helpers/Deferred'
import {
    setDependencies,
    waitForDependencies,
    resolveMissingDependencies,
} from '../dependency-resolution/actions'

import {
    hasDatabindingDependencies,
    getDatabindingDependencyIds,
    hasUserInputDependencies,
} from '../filter-resolvers'

const waitForControllerDependencies = (store, dependenciesIds) => {
    store.dispatch(setDependencies(dependenciesIds))

    return waitForDependencies(store)
}

const getFetchingControllerDependencies = (store, filter) =>
    waitForControllerDependencies(store, getDatabindingDependencyIds(filter))

const getDeferredDependency = modeIsSSR => {
    const {
        promise: deferringDataFetch,
        resolve: resolveDeferredDataFetcher
    } =
    new Deferred()
    // https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide
    // this way we gaurantee deferred controller(dataset) data fetch request
    // to be executed after createControllers returns controllers to the platform
    if (!modeIsSSR) queueMicrotask(resolveDeferredDataFetcher)
    return deferringDataFetch
}
const getUserInputDependency = () => {
    const {
        promise: waitingForUserInput,
        resolve: resolveUserInputDependency
    } =
    new Deferred()
    return {
        waitingForUserInput,
        resolveUserInputDependency
    }
}

const fetchData = ({
    hasPrefetchedData,
    shouldFetchInitialData,
    recordStore,
    errorReporter,
    appLogger,
    store,
    filter,
    datasetIsDeferred,
    modeIsSSR,
}) => {
    const fetchInitialData = () =>
        shouldFetchInitialData ?
        seedDataFetcher({
            recordStore,
            errorReporter,
            appLogger,
        }) :
        Promise.resolve(Maybe.Nothing())

    const fetchingControllerDependencies =
        hasDatabindingDependencies(filter) &&
        getFetchingControllerDependencies(store, filter)

    const deferringDataFetch =
        datasetIsDeferred && getDeferredDependency(modeIsSSR)

    const {
        waitingForUserInput,
        resolveUserInputDependency
    } =
    hasUserInputDependencies(filter) && getUserInputDependency()

    const fetchDataDependencies = [
        fetchingControllerDependencies,
        deferringDataFetch,
        waitingForUserInput,
    ].filter(item => Boolean(item))

    const fetchingInitialData = fetchDataDependencies.length ?
        Promise.all(fetchDataDependencies).then(fetchInitialData) :
        fetchInitialData()

    return {
        fetchingInitialData,
        // TODO: Next 2 methods should be combined in a sync single one immediately after fetchingControllerDeps refactoring
        // because we don't need async in a virtual controller
        resolveUserInputDependency: () =>
            resolveUserInputDependency && resolveUserInputDependency(),
        resolveControllerDependencies: async () => {
            // if by now we are still waiting for dependencies, mark them as resolved
            // since they are guaranteed to perform a handshake with us before our pageReady.
            // A missing dependency can happen in a master-detail scenario where the user
            // deleted the master dataset
            store.dispatch(resolveMissingDependencies())
            await fetchingControllerDependencies
        },
    }
}

export default fetchData