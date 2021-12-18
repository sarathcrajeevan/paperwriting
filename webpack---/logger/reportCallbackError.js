const reportCallbackError = (eventName, errorReporter) => e => {
    errorReporter(`An error occurred in one of ${eventName} callbacks`, e)
}

export default reportCallbackError