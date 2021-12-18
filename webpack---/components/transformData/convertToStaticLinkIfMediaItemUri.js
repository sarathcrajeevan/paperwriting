import imageSDK from '@wix/image-client-api/dist/cjs/sdk'

export default ({
    value,
    mediaItemUtils
}) => {
    const mediaItem = mediaItemUtils.parseMediaItemUri(value)
    if (mediaItem.error) {
        return value
    }

    switch (mediaItem.type) {
        case mediaItemUtils.types.IMAGE:
            return imageSDK.getScaleToFillImageURL(
                mediaItem.mediaId,
                mediaItem.width,
                mediaItem.height,
                mediaItem.width,
                mediaItem.height, {
                    name: mediaItem.title
                },
            )

        case mediaItemUtils.types.VIDEO:
            return `https://video.wixstatic.com/video/${mediaItem.mediaId}/file`
        case mediaItemUtils.types.AUDIO:
            return `https://static.wixstatic.com/mp3/${mediaItem.mediaId}`
        default:
            return value
    }
}