import { PlatformEnvData, PlatformLogger } from '@wix/thunderbolt-symbols'
import { FallbackCorvidModel } from '@wix/editor-elements-corvid-utils'

import { IComponentSDKLoader, createComponentsRegistryPlatform } from './platform'
import { ComponentsRegistryError, ComponentsRegistryErrorTypes } from './errors'

export const getComponentsSDKLoader = async ({
	platformEnvData,
	logger,
}: {
	platformEnvData: PlatformEnvData
	logger: PlatformLogger
}): Promise<IComponentSDKLoader> => {
	const runtime = self.componentsRegistry ? self.componentsRegistry.runtime : null
	const libraries = runtime ? runtime.libraries : platformEnvData.componentsRegistry.librariesTopology

	const mode = platformEnvData.componentsRegistry.mode

	return logger
		.runAsyncAndReport(`import_scripts_componentSdks`, async () => {
			const componentsRegistryPlatform = await createComponentsRegistryPlatform({
				libraries,
				mode,
				loadFallbackSDKModule: () => FallbackCorvidModel.loadSDK() as any,
			})

			return componentsRegistryPlatform.getComponentsSDKsLoader()
		})
		.catch((e) => ({
			sdkTypeToComponentTypes: {},
			loadComponentSdks: () =>
				Promise.reject(
					new ComponentsRegistryError(e.message, e.name, ComponentsRegistryErrorTypes.COMPONENT_LOADING_ERROR)
				),
		}))
}
