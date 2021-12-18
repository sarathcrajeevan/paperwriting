'use strict'

import {
    Maybe
} from '@wix/wix-code-adt'
import {
    every,
    values
} from 'lodash-es'
import actionReducerCreator from '@wix/dbsm-common/src/actionReducer'
import actionTypes from './actionTypes'

const initialState = Maybe.Nothing()

const DEPENDENCY_STATE = {
    UNKNOWN: 'UNKNOWN',
    PERFORMED_HANDSHAKE: 'PERFORMED_HANDSHAKE',
    READY: 'READY',
    MISSING: 'MISSING',
}

const changeDependenciesState = (
    dependencies,
    state,
    initialDependencies = {},
) => {
    return dependencies.reduce((acc, dependencyId) => {
        acc[dependencyId] = state
        return acc
    }, initialDependencies)
}

const reducer = actionReducerCreator(
    initialState,
    new(class {
        [actionTypes.SET_DEPENDENCIES](state, action) {
            return Maybe.Just(
                changeDependenciesState(
                    action.dependenciesIds,
                    DEPENDENCY_STATE.UNKNOWN,
                ),
            )
        }

        [actionTypes.RESOLVE_DEPENDENCIES](state, action) {
            return state.map(dependencyMap =>
                changeDependenciesState(
                    action.dependenciesIds,
                    DEPENDENCY_STATE.READY,
                    dependencyMap,
                ),
            )
        }

        [actionTypes.PERFORM_HANDSHAKES](state, action) {
            return state.map(dependencyMap =>
                changeDependenciesState(
                    action.dependenciesIds,
                    DEPENDENCY_STATE.PERFORMED_HANDSHAKE,
                    dependencyMap,
                ),
            )
        }

        [actionTypes.RESOLVE_MISSING_DEPENDENCIES](state) {
            return state.map(dependencyMap =>
                Object.keys(dependencyMap).reduce((acc, dependencyId) => {
                    acc[dependencyId] =
                        acc[dependencyId] === DEPENDENCY_STATE.UNKNOWN ?
                        DEPENDENCY_STATE.MISSING :
                        acc[dependencyId]
                    return acc
                }, dependencyMap),
            )
        }
    })(),
)

export const areDependenciesResolved = state =>
    state
    .map(dependencyMap =>
        every(
            values(dependencyMap),
            depState =>
            depState === DEPENDENCY_STATE.MISSING ||
            depState === DEPENDENCY_STATE.READY,
        ),
    )
    .getOrElse(false)

export default {
    reducer,
    areDependenciesResolved,
}