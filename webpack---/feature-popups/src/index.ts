import type { ContainerModuleLoader } from '@wix/thunderbolt-ioc'

import { PopupsSymbol, PopupsLinkUtilsAPISymbol, name, PopupUtilsSymbol } from './symbols'
import { LifeCycle, PlatformEvnDataProviderSymbol, SiteLinkClickHandlerSymbol } from '@wix/thunderbolt-symbols'
import { Popups } from './popups'
import { PopupsPageNavigationHandler } from './popupsPageNavigationHandler'
import { PopupLink } from './popupLink'
import { closeButtonWillMount, closeIconButtonWillMount, pageWillMount } from './popupsCloseBehaviors'
import { PopupsLinkUtilsAPI } from './popupsLinkUtilsAPI'
import { PopupUtils } from './popupUtils'
import { PopupsEnvDataProvider } from './popupsEnvDataProvider'
import { ComponentWillMountSymbol } from 'feature-components'

export const site: ContainerModuleLoader = (bind) => {
	bind(PopupsSymbol).to(Popups)
	bind(PlatformEvnDataProviderSymbol).to(PopupsEnvDataProvider)
	bind(PopupUtilsSymbol).to(PopupUtils)
	bind(PopupsLinkUtilsAPISymbol).to(PopupsLinkUtilsAPI)
	bind(SiteLinkClickHandlerSymbol).to(PopupLink)
	bind(LifeCycle.AppWillLoadPageHandler).to(PopupsPageNavigationHandler)
}

export const page: ContainerModuleLoader = (bind) => {
	bind(ComponentWillMountSymbol).to(closeIconButtonWillMount)
	bind(ComponentWillMountSymbol).to(closeButtonWillMount)
	bind(ComponentWillMountSymbol).to(pageWillMount)
}

export const editor: ContainerModuleLoader = site
export const editorPage: ContainerModuleLoader = page

export * from './types'
export { name, PopupsSymbol, PopupsLinkUtilsAPISymbol, PopupUtilsSymbol }
