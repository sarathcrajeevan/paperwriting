import {
    get,
    isPlainObject,
    flow,
    map,
    pickBy,
    uniq
} from 'lodash-es'
import {
    isFieldFromReferencedCollection,
    getReferenceFieldName,
    getFieldFromReferencedCollectionName,
} from '@wix/dbsm-common/src/reference-fields/fieldPath'

const mergeReferences = (firstValue, secondValue) => {
    if (firstValue !== secondValue) {
        return isPlainObject(firstValue) ? firstValue : secondValue
    }
}

const getFieldTypeCreator = (schema, relatedSchemas) => fieldName => {
    if (isFieldFromReferencedCollection(fieldName)) {
        const referenceFieldName = getReferenceFieldName(fieldName)
        const fieldFromReferencedCollectionName =
            getFieldFromReferencedCollectionName(fieldName)
        const referencedCollectionName =
            schema && schema.fields[referenceFieldName] ?
            schema.fields[referenceFieldName].referencedCollection :
            null
        const referencedSchema =
            relatedSchemas && referencedCollectionName ?
            relatedSchemas[referencedCollectionName] :
            null

        return get(referencedSchema, [
            'fields',
            fieldFromReferencedCollectionName,
            'type',
        ])
    }
    return get(schema, ['fields', fieldName, 'type'])
}

const getReferencedCollectionIds = schema => {
    return schema ?
        flow(
            fields =>
            pickBy(fields, ({
                    referencedCollection
                }) =>
                Boolean(referencedCollection),
            ),
            references =>
            map(references, ({
                referencedCollection
            }) => referencedCollection),
            uniq,
            uniqueCollectionIds => uniqueCollectionIds.filter(Boolean),
        )(schema.fields) :
        []
}

const getFieldReferencedCollection = (fieldName, schema) =>
    schema != null && schema.fields[fieldName] != null ?
    schema.fields[fieldName].referencedCollection :
    null

const getSchemaDisplayField = schema =>
    schema != null ? schema.displayField : null

const getSchemaMaxPageSize = schema =>
    schema != null ? schema.maxPageSize : undefined

export {
    mergeReferences,
    getFieldTypeCreator,
    getReferencedCollectionIds,
    getFieldReferencedCollection,
    getSchemaDisplayField,
    getSchemaMaxPageSize,
}