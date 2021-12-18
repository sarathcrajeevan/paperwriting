import _ from 'lodash'
import type { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { withDependencies } from '@wix/thunderbolt-ioc'
import { BusinessLoggerFactory } from './businessLogger'
import { BsiManagerSymbol, name, PageNumberSymbol } from './symbols'
import {
	LifeCycle,
	WixCodeSdkHandlersProviderSym,
	BusinessLoggerSymbol,
	SamePageUrlChangeListenerSymbol,
} from '@wix/thunderbolt-symbols'
import { bsiSdkHandlersProvider } from './bsiSdkHandlersProvider'
import { BsiManager } from './bsiManager'
import { PageNumberHandler } from './pageNumber'

export const site: ContainerModuleLoader = (bind) => {
	bind(BusinessLoggerSymbol).to(BusinessLoggerFactory)
	bind(BsiManagerSymbol).to(BsiManager)
	bind(PageNumberSymbol, LifeCycle.AppWillLoadPageHandler, SamePageUrlChangeListenerSymbol).to(PageNumberHandler)
	bind(WixCodeSdkHandlersProviderSym).to(bsiSdkHandlersProvider)
}

export const editor: ContainerModuleLoader = (bind) => {
	bind(WixCodeSdkHandlersProviderSym).to(
		withDependencies([], () => {
			return {
				getSdkHandlers: () => ({
					reportActivity: _.noop,
				}),
			}
		})
	)
}

export type { BusinessLogger, IBsiManager, IPageNumber } from './types'
export { BsiManagerSymbol, PageNumberSymbol, name }
