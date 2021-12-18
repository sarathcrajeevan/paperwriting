import {
    MEDIA_GALLERY_ROLE,
    RATINGSDISPLAY_ROLE,
    GOOGLEMAP_ROLE,
    PROGRESS_BAR_ROLE,
    TIMEPICKER_ROLE,
    RICH_CONTENT_ROLE,
} from '@wix/wix-data-client-common/src/connection-config/roles'
import {
    flow
} from 'lodash-es'
import convertValueToString from './convertValueToString'
import convertToStaticLinkIfMediaItemUri from './convertToStaticLinkIfMediaItemUri'
import {
    isDateValid,
    getTimeFromDate
} from './dateTimeUtils'
import {
    FieldType
} from '@wix/wix-data-schema-types'

const {
    mediaGallery,
    address
} = FieldType

export default (
    value, {
        fieldType,
        role,
        componentIsInput,
        propPath,
        mediaItemUtils
    },
) => {
    const arrayOfConvertorsAndConditions = [{
            converter: ({
                formatted
            }) => formatted,
            condition: value && fieldType === address,
        },
        {
            converter: convertValueToString,
            condition:
                !componentIsInput &&
                ![
                    RATINGSDISPLAY_ROLE,
                    MEDIA_GALLERY_ROLE,
                    PROGRESS_BAR_ROLE,
                    RICH_CONTENT_ROLE,
                ].includes(role),
        },
        {
            converter: value =>
                convertToStaticLinkIfMediaItemUri({
                    value,
                    mediaItemUtils
                }),
            condition: propPath === 'link' && GOOGLEMAP_ROLE !== role,
        },
        {
            converter: () => [],
            condition: !value && fieldType === mediaGallery,
        },
        {
            converter: getTimeFromDate,
            condition: role === TIMEPICKER_ROLE && isDateValid(value),
        },
    ]

    const conversionFlow = arrayOfConvertorsAndConditions.reduce(
        (acc, {
            converter,
            condition
        }) => {
            if (condition) acc.push(converter)
            return acc
        }, [],
    )

    return flow(conversionFlow)(value)
}