export default class Deferred {
    constructor() {
        const deferred = {}

        deferred.promise = new Promise((resolve, reject) => {
            deferred.resolve = (...args) => {
                resolve(...args)
                return deferred.promise
            }
            deferred.reject = (...args) => {
                // eslint-disable-next-line prefer-promise-reject-errors
                reject(...args)
                return deferred.promise
            }
        })

        return deferred
    }
}