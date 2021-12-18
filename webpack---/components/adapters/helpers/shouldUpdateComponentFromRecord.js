'use strict'
import {
    includes
} from 'lodash-es'
import {
    isFieldFromReferencedCollection,
    getReferenceFieldName,
} from '@wix/dbsm-common/src/reference-fields/fieldPath'

const shouldSetAllFields = updatedFields => updatedFields.length === 0

const wasFieldUpdated = (fieldName, updatedFields) =>
    includes(
        updatedFields,
        isFieldFromReferencedCollection(fieldName) ?
        getReferenceFieldName(fieldName) :
        fieldName,
    )

export default ({
    updatedFields,
    fieldName
}) =>
shouldSetAllFields(updatedFields) || wasFieldUpdated(fieldName, updatedFields)