import { WixCodeApi, WixCodeNamespacesRegistry } from '@wix/thunderbolt-symbols'

const DEFAULT = 'default'

export const createWixCodeNamespacesRegistry = (): WixCodeNamespacesRegistry => {
	const wixCodeNamespaces: { [appDefinitionId: string]: WixCodeApi } = {}

	return {
		get(namespace, appDefinitionId = DEFAULT) {
			if (!wixCodeNamespaces[appDefinitionId][namespace]) {
				throw new Error(`get(${namespace}) cannot be used inside the factory function of the namespace`)
			}
			return wixCodeNamespaces[appDefinitionId][namespace]
		},
		registerWixCodeNamespaces(namespaces, appDefinitionId = DEFAULT) {
			wixCodeNamespaces[appDefinitionId] = namespaces
		},
	}
}
