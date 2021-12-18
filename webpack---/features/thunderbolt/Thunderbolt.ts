import { ContainerModuleLoader, multi, withDependencies } from '@wix/thunderbolt-ioc'
import {
	DomReadySymbol,
	IAppWillMountHandler,
	LifeCycle,
	IAppDidMountHandler,
	IStructureAPI,
	StructureAPI as StructureAPISym,
	CurrentRouteInfoSymbol,
	ILogger,
	LoggerSymbol,
} from '@wix/thunderbolt-symbols'
import { RendererPropsProviderSym, IRendererPropsProvider } from 'feature-react-renderer'
import { NavigationInfoSym, Thunderbolt } from './symbols'
import { IThunderboltClient } from './IThunderbolt'
import { createDomReadyPromise, WaitForDomReady } from './DomReady'
import { NavigationInfo } from './NavigationInfo'
import { taskify } from '@wix/thunderbolt-commons'
import { ICurrentRouteInfo } from 'feature-router'

const thunderboltImpl = withDependencies(
	[
		multi(LifeCycle.AppWillMountHandler),
		multi(LifeCycle.AppDidMountHandler),
		StructureAPISym,
		CurrentRouteInfoSymbol,
		RendererPropsProviderSym,
		LoggerSymbol,
	],
	(
		appWillMountHandlers: Array<IAppWillMountHandler>,
		appDidMountHandlers: Array<IAppDidMountHandler>,
		structureAPI: IStructureAPI,
		currentRouteInfo: ICurrentRouteInfo,
		rendererProps: IRendererPropsProvider,
		logger: ILogger
	): IThunderboltClient => ({
		ready: async () => {
			logger.phaseStarted(`structureAPI_addShellStructure`)
			await structureAPI.addShellStructure()
			logger.phaseEnded(`structureAPI_addShellStructure`)
			const initThings = appWillMountHandlers.map((appWillMountHandler) =>
				taskify(() => appWillMountHandler.appWillMount())
			)
			logger.phaseStarted(`features_appWillMount`)
			await Promise.all([rendererProps.resolveRendererProps(), ...initThings])
			logger.phaseEnded(`features_appWillMount`)
		},
		appDidMount: () => {
			appDidMountHandlers.map((appDidMountHandler) => appDidMountHandler.appDidMount())
			const route = currentRouteInfo.getCurrentRouteInfo()
			return {
				firstPageId: (route && route.pageId) || 'PROTECTED',
			}
		},
		getRendererProps: () => rendererProps.getRendererProps(),
	})
)

export const site: ContainerModuleLoader = (bind) => {
	bind(Thunderbolt).to(thunderboltImpl)
	if (process.env.browser) {
		bind(DomReadySymbol).toConstantValue(createDomReadyPromise())
		bind(LifeCycle.AppWillMountHandler).to(WaitForDomReady)
	}
	const navigationInfo = new NavigationInfo()
	bind(LifeCycle.PageWillMountHandler).toConstantValue(navigationInfo)
	bind(NavigationInfoSym).toConstantValue(navigationInfo)
}
