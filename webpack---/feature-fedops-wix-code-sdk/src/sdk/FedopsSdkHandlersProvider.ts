import { withDependencies } from '@wix/thunderbolt-ioc'
import { ILogger, LoggerSymbol, SdkHandlersProvider } from '@wix/thunderbolt-symbols'
import { FedopsnWixCodeSdkHandlers } from '../types'
import { name } from '../symbols'

export const FedopsSdkHandlersProvider = withDependencies(
	[LoggerSymbol],
	(logger: ILogger): SdkHandlersProvider<FedopsnWixCodeSdkHandlers> => {
		return {
			getSdkHandlers: () => ({
				[name]: {
					registerWidgets: (widgetAppNames: Array<string>) => {
						logger.registerPlatformWidgets(widgetAppNames)
					},
				},
			}),
		}
	}
)
