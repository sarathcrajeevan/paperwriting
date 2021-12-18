import { AppParams, PlatformEnvData, ViewerAppSpecData } from '@wix/thunderbolt-symbols'
import { BlocksPreviewAppDefId, WixCodeAppDefId, DataBindingAppDefId } from '../constants'
import { RouterConfig } from '@wix/thunderbolt-ssr-api'
import { DataBindingViewerAppUtils } from '../dataBindingViewerAppUtils'
import { WixCodeViewerAppUtils } from '../wixCodeViewerAppUtils'
import { BlocksAppsUtils } from '../blocksAppsUtils'

export function createAppParams({
	appSpecData,
	wixCodeViewerAppUtils,
	blocksAppsUtils,
	dataBindingViewerAppUtils,
	dynamicRouteData,
	routerConfigMap,
	appInstance,
	baseUrls,
	viewerScriptUrl,
	blocksData,
}: {
	appSpecData: ViewerAppSpecData
	wixCodeViewerAppUtils: WixCodeViewerAppUtils
	blocksAppsUtils: BlocksAppsUtils
	dataBindingViewerAppUtils: DataBindingViewerAppUtils
	dynamicRouteData?: PlatformEnvData['router']['dynamicRouteData']
	routerConfigMap: Array<RouterConfig> | null
	appInstance: string
	baseUrls: Record<string, string> | null | undefined
	viewerScriptUrl: string
	blocksData: unknown
}): AppParams {
	const specificAppDataByApp: { [appDefId: string]: (appData: ViewerAppSpecData) => any } = {
		[WixCodeAppDefId]: wixCodeViewerAppUtils.createWixCodeAppData,
		[BlocksPreviewAppDefId]: blocksAppsUtils.createBlocksPreviewAppData,
		[DataBindingAppDefId]: dataBindingViewerAppUtils.createAppData,
	}

	const createSpecificAppData = () => {
		if (blocksAppsUtils.isBlocksApp(appSpecData)) {
			return blocksAppsUtils.createBlocksConsumerAppData(appSpecData)
		}

		return specificAppDataByApp[appSpecData.appDefinitionId]?.(appSpecData)
	}

	return {
		appInstanceId: appSpecData.appDefinitionId,
		appDefinitionId: appSpecData.appDefinitionId,
		appName: appSpecData.appDefinitionName || appSpecData.type || appSpecData.appDefinitionId,
		instanceId: appSpecData.instanceId,
		instance: appInstance,
		url: viewerScriptUrl,
		baseUrls,
		appData: createSpecificAppData(),
		appRouters: routerConfigMap,
		routerReturnedData: dynamicRouteData?.pageData, // TODO deprecate this in favor of wixWindow.getRouterData()
		blocksData,
	}
}
