import { IComponentsRegistrar } from '@wix/thunderbolt-components-loader'
import { getGlobalRegistryRuntime, getComponentsLibrariesFromViewerModel } from './runtime'

import { registry, IThunderboltComponentsRegistry } from '@wix/editor-elements-registry/2.0/thunderbolt'

/**
 * Components Registry for Thunderbolt Client Side Rendering
 */
export interface IComponentsRegistryCSR {
	getRegistryAPI: () => IThunderboltComponentsRegistry
	/**
	 * Legacy API is used for migrating to the thunderbolt + registry integration
	 */
	getComponentsLibrariesAPI: () => IComponentsRegistrar
}

export async function createComponentsRegistryCSR({
	usePartialManifests = false,
}: { usePartialManifests?: boolean } = {}): Promise<IComponentsRegistryCSR> {
	await window.componentsRegistry.runtimeReady

	const runtime = getGlobalRegistryRuntime()
	const libraries = usePartialManifests ? getComponentsLibrariesFromViewerModel() : []
	const registryAPI = await registry({
		options: {
			useScriptsInsteadOfEval: true,
			usePartialManifests,
		},
		mode: 'lazy',
		libraries: [...(runtime?.libraries || []), ...libraries],
	})

	/**
	 * Workaround until deduplication is fixed at registry
	 */
	let pending: Promise<void> | null = null
	return {
		getComponentsLibrariesAPI() {
			return {
				getComponents() {
					return registryAPI.getComponentsLoaders()
				},
				async getAllComponentsLoaders() {
					if (!pending) {
						pending = registryAPI.ensureManifestsAreLoaded()
					}

					await pending

					return registryAPI.getComponentsLoaders()
				},
			}
		},
		getRegistryAPI() {
			return registryAPI
		},
	}
}
