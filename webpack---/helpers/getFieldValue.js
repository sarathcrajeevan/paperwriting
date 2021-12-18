'use strict'

import {
    get,
    isObject
} from 'lodash-es'
import {
    Maybe
} from '@wix/wix-code-adt'
import {
    isFieldFromReferencedCollection,
    getReferenceFieldName,
    getFieldFromReferencedCollectionName,
} from '@wix/dbsm-common/src/reference-fields/fieldPath'

const getFieldValue = fieldName => record => get(record, fieldName)

const getReference = fieldPath => record =>
    Maybe.fromNullable(get(record, getReferenceFieldName(fieldPath)))

const getFieldFromReference = fieldPath => reference =>
    Maybe.fromNullable(reference)
    .chain(reference =>
        isObject(reference) ? Maybe.Just(reference) : Maybe.Nothing(),
    )
    .map(referencedRecord =>
        getFieldValue(getFieldFromReferencedCollectionName(fieldPath))(
            referencedRecord,
        ),
    )
    .getOrElse(undefined)

export default (record, fieldPath) =>
isFieldFromReferencedCollection(fieldPath) ?
    getReference(fieldPath)(record)
    .map(getFieldFromReference(fieldPath))
    .getOrElse(undefined) :
    getFieldValue(fieldPath)(record)