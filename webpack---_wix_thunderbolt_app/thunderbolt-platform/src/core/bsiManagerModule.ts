import { BootstrapData } from '../types'
import { ManagerSlave } from '@wix/bsi-manager'
import { ICommonConfigModule } from './commonConfigModule'
import { CommonConfig } from '@wix/thunderbolt-symbols'

export default function (commonConfigModule: ICommonConfigModule, bootstrapData: BootstrapData, createSdkHandlers: (pageId: string) => any): ManagerSlave {
	const sdkHandlers = createSdkHandlers(bootstrapData.currentPageId)

	const readOnlyCommonConfig = {
		get: (key: keyof CommonConfig) => commonConfigModule.get()[key],
		subscribe: commonConfigModule.registerToChange,
	}

	const consentPolicy = {
		policy: {
			analytics: true, // TODO: real
			functional: true, // TODO: real
		},
	}

	return new ManagerSlave()
		.init(
			{
				getCommonConfig: () => readOnlyCommonConfig,
				getConsentPolicy: () => consentPolicy,
			},
			{ enableCookie: false }
		)
		.onActivity(() => {
			sdkHandlers.reportActivity()
		})
}
