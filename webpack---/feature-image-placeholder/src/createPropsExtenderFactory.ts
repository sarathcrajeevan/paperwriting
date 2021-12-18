import type { ImagePlaceholder, ImagePlaceholderData, ImagePlaceholderPageConfig } from './types'
import { IComponentPropsExtender } from 'feature-components'
import { IMAGE_PLACEHOLDER_COMPONENTS_TYPES } from './imagePlaceholderComponentTypes'

export default function createFactory(imageClientApi: any) {
	return (
		pageConfig: ImagePlaceholderPageConfig
	): IComponentPropsExtender<
		{ getPlaceholder: (imagePlaceholderData: ImagePlaceholderData) => ImagePlaceholder },
		unknown
	> => {
		const { isSEOBot, shouldAutoEncodeImageFormat, staticMediaUrl } = pageConfig

		const getPlaceholder = ({ fittingType, src, target }: ImagePlaceholderData): ImagePlaceholder => {
			const placeholder = imageClientApi.getPlaceholder(fittingType, src, target, {
				isSEOBot,
			})
			if (placeholder && placeholder.uri && !placeholder.uri.includes('http')) {
				if (shouldAutoEncodeImageFormat) {
					const index = placeholder.uri.lastIndexOf('/')
					placeholder.uri = `${placeholder.uri.substr(0, index)},enc_auto${placeholder.uri.substr(index)}`
				}
				placeholder.uri = `${staticMediaUrl}/${placeholder.uri}`
			}
			return placeholder
		}

		return {
			componentTypes: IMAGE_PLACEHOLDER_COMPONENTS_TYPES,
			getExtendedProps: () => ({ getPlaceholder }),
		}
	}
}
