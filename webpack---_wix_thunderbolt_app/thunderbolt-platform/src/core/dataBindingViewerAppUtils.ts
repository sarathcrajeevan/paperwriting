import _ from 'lodash'
import { ViewerAppSpecData } from '@wix/thunderbolt-symbols'
import { BootstrapData } from '../types'

interface DataBindingViewerAppData {
	gridAppId: string
}

export interface DataBindingViewerAppUtils {
	createAppData(appData: ViewerAppSpecData): DataBindingViewerAppData
}

export default function ({ bootstrapData }: { bootstrapData: BootstrapData }) {
	const {
		wixCodeBootstrapData: { wixCodeModel },
		platformEnvData: { commonConfig },
	} = bootstrapData

	return {
		createAppData() {
			return {
				gridAppId: _.get(wixCodeModel, 'appData.codeAppId'),
				commonConfig,
			}
		},
	}
}
