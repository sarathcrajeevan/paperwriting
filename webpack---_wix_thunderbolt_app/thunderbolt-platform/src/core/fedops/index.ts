import _ from 'lodash'
import type { PlatformEnvData, ModelsAPI } from '@wix/thunderbolt-symbols'
import { name } from 'feature-fedops-wix-code-sdk'

export const FedopsWebVitalsManager = ({ platformEnvData, modelsApi, handlers }: { platformEnvData: PlatformEnvData; modelsApi: ModelsAPI; handlers: { [name]: { registerWidgets: Function } } }) => {
	return {
		registerWidgets: () => {
			if (process.env.browser && platformEnvData.bi.pageData.pageNumber === 1) {
				const widgetAppNames = _(modelsApi.getApplications())
					.entries()
					.flatMap(([app, widgets]) => {
						return _(widgets)
							.values()
							.map((widget) => `${app}_${widget.controllerType}`)
							.value()
					})
					.value()
				handlers[name].registerWidgets(widgetAppNames)
			}
		},
	}
}
