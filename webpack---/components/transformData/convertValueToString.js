'use strict'

export default value =>
    value == null || typeof value.toString !== 'function' ?
    '' :
    Array.isArray(value) ?
    value.join(', ') :
    value.toString()