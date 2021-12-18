import _ from 'lodash'
import type { ComponentSdkFactory } from '@wix/thunderbolt-platform-types'
import type { ModelsAPI } from '@wix/thunderbolt-symbols'
import type { WixSelector } from '../wixSelector'
import { getPageBackgroundId } from '@wix/thunderbolt-commons'

export function DocumentSdkFactory({ wixSelector, modelsApi, currentPageId }: { wixSelector: WixSelector; modelsApi: ModelsAPI; currentPageId: string }): ComponentSdkFactory {
	const findCompId = (compType: string) => _.findKey(modelsApi.getStructureModel(), { componentType: compType })

	return ({ controllerCompId }) => ({
		get type() {
			return '$w.Document'
		},
		get children() {
			return ['Page', 'HeaderContainer', 'FooterContainer'].map((compType) => {
				const compId = findCompId(compType) as string
				return wixSelector.getInstance({ controllerCompId, compId, compType, role: 'Document' })
			})
		},
		get background() {
			const compType = 'PageBackground'
			const compId = getPageBackgroundId(currentPageId)
			return wixSelector.getInstance({ controllerCompId, compId, compType, role: 'Document' }).background
		},
		toJSON() {
			return {} // implemented bolt behavior to fix TB-2911
		},
	})
}
