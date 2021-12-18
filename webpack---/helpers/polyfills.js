'use strict'
/* global self */

if (typeof self.queueMicrotask !== 'function') {
    self.queueMicrotask = function(callback) {
        Promise.resolve()
            .then(callback)
            .catch(e =>
                setTimeout(() => {
                    throw e
                }),
            ) // report exceptions
    }
}