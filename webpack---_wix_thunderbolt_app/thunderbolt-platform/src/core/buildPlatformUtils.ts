import { BiUtils, ConsentPolicyManager, LinkUtils, LocationManager, PlatformUtils, SessionServiceAPI, WarmupDataManager, ClientSpecMapAPI } from '@wix/thunderbolt-symbols'
import type { ViewerPlatformEssentials } from '@wix/fe-essentials-viewer-platform'
import { AppsPublicApiManager } from './appsPublicApiManager'

export const BuildPlatformUtils = ({
	linkUtils,
	sessionService,
	appsPublicApiManager,
	biUtils,
	locationManager,
	essentials,
	warmupDataManager,
	consentPolicyManager,
	clientSpecMapApi,
}: {
	linkUtils: LinkUtils
	sessionService: SessionServiceAPI
	appsPublicApiManager: AppsPublicApiManager
	biUtils: BiUtils
	locationManager: LocationManager
	essentials: ViewerPlatformEssentials
	warmupDataManager: WarmupDataManager
	consentPolicyManager: ConsentPolicyManager
	clientSpecMapApi: ClientSpecMapAPI
}): PlatformUtils => ({
	linkUtils,
	sessionService,
	appsPublicApisUtils: {
		getPublicAPI: appsPublicApiManager.getPublicApi,
	},
	biUtils,
	locationManager,
	essentials,
	warmupDataManager,
	consentPolicyManager,
	clientSpecMapApi,
})
