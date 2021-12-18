'use strict'

import uuid from 'uuid'
import {
    omit
} from 'lodash-es'
import {
    isPristine
} from './symbols'

const getRecordId = record => record._id

const hasDraft = record => typeof record[isPristine] === 'boolean'

const isRecordPristine = record =>
    typeof record[isPristine] !== 'boolean' || record[isPristine]

const markRecordDirty = record => ({
    ...record,
    [isPristine]: false,
})

const createDraft = (defaultDraft, recordId) => ({
    ...defaultDraft,
    _id: recordId || uuid.v4(),
    [isPristine]: true,
})

const isSameRecord = (a, b) => a && b && a._id === b._id

const cleanseRecord = record => omit(record, [isPristine])

const mergeRecord = (record, ...fieldsAndValues) => {
    return Object.assign({},
        record,
        ...fieldsAndValues.map(object => omit(object, ['_id'])),
    )
}

export {
    cleanseRecord,
    createDraft,
    getRecordId,
    hasDraft,
    isRecordPristine,
    isSameRecord,
    markRecordDirty,
    mergeRecord,
}