'use strict'

import {
    Maybe
} from '@wix/wix-code-adt'
import Immediate from './immediate'
import {
    traceCreators
} from '../logger'

export default ({
    recordStore,
    errorReporter,
    appLogger
}) => {
    const prefetchFirstRecord = service => {
        const fetchPromise = service
            .seed()
            .then(() =>
                service
                .getRecords(0, 1)
                .then(queryResult =>
                    queryResult.chain(({
                        items
                    }) => Maybe.Just(items[0])),
                ),
            )
            .catch(e => {
                errorReporter('Failed to load initial data', e)
                return Maybe.Nothing()
            })

        return fetchPromise
    }

    const getFirstPrefetchedRecord = service =>
        service.getSeedRecords().matchWith({
            Empty: () => Immediate.resolve(Maybe.Nothing()),
            Results: ({
                items
            }) => Immediate.resolve(Maybe.Just(items[0])),
        })

    const getFirstRecord = () =>
        recordStore().fold(
            () => Promise.resolve(Maybe.Nothing()),
            service =>
            service.hasSeedData() ?
            getFirstPrefetchedRecord(service) :
            appLogger.traceAsync(traceCreators.pageReadyGetData(), () =>
                prefetchFirstRecord(service),
            ),
        )

    return getFirstRecord()
}