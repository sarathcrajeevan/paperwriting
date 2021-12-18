import {
    isObject,
    has
} from 'lodash-es'

const isRecord = something => isObject(something) && has(something, '_id')

export default isRecord