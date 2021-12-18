'use strict'

import {
    mapKeys,
    startsWith,
    assign,
    get
} from 'lodash-es'
import {
    Maybe
} from '@wix/wix-code-adt'
import {
    FieldType
} from '@wix/wix-data-schema-types'

const {
    richText
} = FieldType
const dynamicPropertiesHandlers = {
    $text: fieldType =>
        fieldType.map(ft => (ft === richText ? 'html' : 'text')).getOrElse('text'),
}

const resolveDynamicProperty = (propName, propertyConfig, getFieldType) =>
    Maybe.fromNullable(dynamicPropertiesHandlers[propName])
    .map(propHandler => propHandler(getFieldType(propertyConfig.fieldName)))
    .getOrElse(propName)

const resolveDynamicProperties = ({
        connectionConfig
    }, role, getFieldType) =>
    Maybe.fromNullable(get(connectionConfig, 'properties'))
    .map(properties =>
        mapKeys(connectionConfig.properties, (property, propName) =>
            startsWith(propName, '$') ?
            resolveDynamicProperty(propName, property, getFieldType) :
            propName,
        ),
    )
    .map(properties => assign({}, connectionConfig, {
        properties
    }))
    .getOrElse(connectionConfig)

export {
    resolveDynamicProperties
}