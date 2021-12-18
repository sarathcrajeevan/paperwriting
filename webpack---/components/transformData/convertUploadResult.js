import {
    wixCodeItemToProGallery,
    proGalleryItemToWixCode,
} from '@wix/pro-gallery-items-formatter'
import {
    FieldType
} from '@wix/wix-data-schema-types'

const {
    mediaGallery,
    documentArray
} = FieldType
const convertUploadedFileUrlToMediaGalleryItem = ({
    uploadedFileUrl,
    mediaItemUtils,
}) => {
    const mediaItem = mediaItemUtils.parseMediaItemUri(uploadedFileUrl)
    const mediaItemUri = mediaItemUtils.createMediaItemUri(mediaItem).item
    const proGalleryItem = wixCodeItemToProGallery({
        ...mediaItem,
        src: mediaItemUri,
    })

    return proGalleryItemToWixCode(proGalleryItem)
}

export default ({
    value: files,
    currentValue = [],
    fieldType,
    mediaItemUtils,
}) => {
    switch (fieldType) {
        case mediaGallery:
            return [
                ...currentValue,
                ...files.map(({
                        fileUrl,
                        url
                    }) =>
                    convertUploadedFileUrlToMediaGalleryItem({
                        uploadedFileUrl: fileUrl || url,
                        mediaItemUtils,
                    }),
                ),
            ]
        case documentArray:
            return [
                ...currentValue,
                ...files.map(({
                    fileUrl,
                    url
                }) => fileUrl || url),
            ]
        default:
            return files[0].fileUrl || files[0].url
    }
}