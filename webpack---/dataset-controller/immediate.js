'use strict'

const runImmediate = (fn, value) => {
    try {
        return resolve(fn(value))
    } catch (e) {
        return reject(e)
    }
}

const resolve = value => ({
    value,
    then: fn => runImmediate(fn, value),
    catch: () => resolve(value),
})

const reject = error => ({
    error,
    then: () => reject(error),
    catch: fn => runImmediate(fn, error),
})

export default {
    resolve,
    reject
}