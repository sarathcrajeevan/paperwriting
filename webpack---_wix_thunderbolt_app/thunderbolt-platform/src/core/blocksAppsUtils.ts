import _ from 'lodash'
import { BootstrapData } from '../types'
import { ViewerAppSpecData } from '@wix/thunderbolt-symbols'

export interface BlocksPreviewAppData {
	blocksPreviewData: {
		widgetsCodeMap: {
			[pageId: string]: {
				url: string
			}
		}
		widgetDescriptorsMap: { [widgetType: string]: object }
	}
}
interface BlocksConsumerAppData {
	blocksConsumerData: {
		codeExperimentsQueryString: string
	}
}

export interface BlocksAppsUtils {
	createBlocksPreviewAppData(appData: ViewerAppSpecData): BlocksPreviewAppData
	createBlocksConsumerAppData(appData: ViewerAppSpecData): BlocksConsumerAppData
	isBlocksApp(appData: ViewerAppSpecData): boolean
}

export default function ({ bootstrapData }: { bootstrapData: BootstrapData }): BlocksAppsUtils {
	const {
		wixCodeBootstrapData: { wixCodePageIds },
		platformEnvData,
	} = bootstrapData
	return {
		createBlocksPreviewAppData() {
			return {
				blocksPreviewData: {
					widgetsCodeMap: _.mapValues(wixCodePageIds, (url) => ({ url })),
					widgetDescriptorsMap: platformEnvData.blocks?.blocksPreviewData?.widgetDescriptorsMap ?? {},
				},
			}
		},
		createBlocksConsumerAppData() {
			return {
				blocksConsumerData: {
					codeExperimentsQueryString: bootstrapData.blocksBootstrapData.experimentsQueryParams,
				},
			}
		},
		isBlocksApp({ appDefinitionId }) {
			return Boolean(bootstrapData.blocksBootstrapData?.blocksAppsData?.[appDefinitionId])
		},
	}
}
