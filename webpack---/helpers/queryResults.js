'use strict'

import {
    union
} from '@wix/wix-code-adt'

const derivedMethods = {
    chain: variant => fn => {
        return variant.matchWith({
            Empty: () => variant,
            Results: ({
                items,
                totalCount,
                offset
            }) => {
                return fn({
                    items,
                    totalCount,
                    offset,
                })
            },
        })
    },

    map: variant => fn => {
        return variant.matchWith({
            Empty: () => variant,
            Results: ({
                items: currItems,
                totalCount: currTotalCount,
                offset: currOffset,
            }) => {
                const {
                    items = currItems,
                        totalCount = currTotalCount,
                        offset = currOffset,
                } = fn({
                    items: currItems,
                    totalCount: currTotalCount,
                    offset: currOffset,
                })
                return QueryResultsADT.Results(items, totalCount, offset)
            },
        })
    },

    filter: variant => fn => {
        return variant.matchWith({
            Empty: () => variant,
            Results: ({
                items,
                totalCount,
                offset
            }) => {
                return fn({
                        items,
                        totalCount,
                        offset,
                    }) ?
                    variant :
                    QueryResultsADT.Empty()
            },
        })
    },

    orElse: variant => fn => {
        return variant.matchWith({
            Empty: () => fn(),
            Results: () => variant,
        })
    },

    get: variant => () => {
        return variant.matchWith({
            Empty: () => ({
                items: [],
                totalCount: 0,
                offset: 0
            }),
            Results: results => results,
        })
    },

    of: () => of ,
}

const QueryResultsADT = union(
    'QueryResults', {
        Empty: () => ({}),
        Results: (items, totalCount, offset = 0) => ({
            items,
            totalCount,
            offset
        }),
    },
    derivedMethods,
)

function of ({
    items,
    totalCount,
    offset
}) {
    return totalCount > 0 && Array.isArray(items) ?
        QueryResultsADT.Results(items, totalCount, offset) :
        QueryResultsADT.Empty()
}

function fromWixDataQueryResults(wixDataQueryResults, offset) {
    return wixDataQueryResults ?
        this.of({
            items: wixDataQueryResults.items,
            totalCount: wixDataQueryResults.totalCount,
            offset,
        }) :
        QueryResultsADT.Empty()
}

export default {
    Empty: QueryResultsADT.Empty,
    Results: QueryResultsADT.Results,
    fromWixDataQueryResults,
    of ,
}