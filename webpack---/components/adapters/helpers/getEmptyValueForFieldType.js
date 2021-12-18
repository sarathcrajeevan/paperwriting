import {
    FieldType
} from '@wix/wix-data-schema-types'

const {
    mediaGallery
} = FieldType

export default fieldType => (fieldType === mediaGallery ? [] : undefined)