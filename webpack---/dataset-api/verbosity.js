import {
    isEmpty,
    isError,
    isUndefined,
    noop
} from 'lodash-es'

function isPromise(something) {
    return something && typeof something.then === 'function'
}

function handleSuccess(verboseReporter, explicitName, result) {
    const verboseArgs = isUndefined(result) ?
        [`[wix-dataset.${explicitName}] returned`] :
        [
            `[wix-dataset.${explicitName}] returned with (`,
            JSON.stringify(result),
            `)`,
        ]
    verboseReporter(...verboseArgs)
}

const nullVerboseReporter = noop
const callbacksRegistration = [
    'onReady',
    'onError',
    'onBeforeSave',
    'onAfterSave',
    'onCurrentIndexChanged',
    'onItemValuesChanged',
]
const DEPRECATED_METHODS_MAP = new Map([
    ['new', 'add']
])

const reportCallInfo = (reporter, methodName, args) => {
    const verboseArgs =
        args.length === 0 ?
        [`[wix-dataset.${methodName}] called`] :
        [`[wix-dataset.${methodName}] called with (`, JSON.stringify(args), `)`]

    reporter(...verboseArgs)
}

const reportDeprecationInfo = (reporter, methodName) => {
    if (!DEPRECATED_METHODS_MAP.has(methodName)) return
    const replacementMethodName = DEPRECATED_METHODS_MAP.get(methodName)
    const replacementMessage = replacementMethodName ?
        `; use [wix-dataset.${replacementMethodName}] instead` :
        ''
    const deprecationMessage = `[wix-dataset.${methodName}] is deprecated${replacementMessage}`
    reporter(deprecationMessage)
}

const verboseWrapper =
    (verboseReporter, func, explicitName) =>
    (...args) => {
        if (callbacksRegistration.includes(explicitName)) {
            verboseReporter(`[${explicitName} callback registered] on wix-dataset`)
            return func(...args)
        }

        reportCallInfo(verboseReporter, explicitName, args)
        reportDeprecationInfo(verboseReporter, explicitName)

        const result = func(...args)
        if (isPromise(result)) {
            return result.then(result => {
                handleSuccess(verboseReporter, explicitName, result)
                return result
            })
        }
        handleSuccess(verboseReporter, explicitName, result)
        return result
    }

const shouldWrapWithVerbose = verboseReporter =>
    verboseReporter !== nullVerboseReporter

const verboseEvent = (verboseReporter, eventName, ...eventData) => {
    if (isEmpty(eventData)) {
        verboseReporter(`[${eventName} event] triggered on wix-dataset`)
    } else {
        const stringifiedErrors = eventData.map(datum =>
            isError(datum) ? datum.toString() : datum,
        )
        verboseReporter(
            `[${eventName} event] triggered on wix-dataset with (`,
            JSON.stringify(stringifiedErrors),
            `)`,
        )
    }
}

export {
    verboseWrapper,
    shouldWrapWithVerbose,
    verboseEvent,
    nullVerboseReporter,
}