'use strict'
import {
    noop,
    remove
} from 'lodash-es'
import {
    reportCallbackError
} from '../logger'
import {
    verboseEvent
} from '../dataset-api/verbosity'

const eventListenersCreator = (
    firePlatformEvent = noop,
    errorReporter = noop,
    verboseReporter = noop,
) => {
    let isDisposed = false
    let callbacks = {}

    const getCallbacks = eventName =>
        callbacks[eventName] ? callbacks[eventName] : (callbacks[eventName] = []) // WeakSet is not iterable.

    const register = (eventName, cb) => {
        if (isDisposed) {
            return noop
        }

        getCallbacks(eventName).push(cb)
        return () => {
            remove(getCallbacks(eventName), f => f === cb)
        }
    }

    const executeHooks = (eventName, ...args) => {
        return Promise.all(
            getCallbacks(eventName).map(cb => {
                try {
                    // eslint-disable-next-line node/no-callback-literal
                    return Promise.resolve(cb(...args))
                } catch (err) {
                    return Promise.reject(err)
                }
            }),
        )
    }

    const fireEvent = (eventName, ...args) => {
        verboseEvent(verboseReporter, eventName, ...args)
        firePlatformEvent(eventName, ...args)
        executeHooks(eventName, ...args).catch(
            reportCallbackError(eventName, errorReporter),
        )
    }

    const dispose = () => {
        isDisposed = true
        callbacks = {}
    }

    return {
        register,
        executeHooks,
        fireEvent,
        dispose,
    }
}

export default eventListenersCreator