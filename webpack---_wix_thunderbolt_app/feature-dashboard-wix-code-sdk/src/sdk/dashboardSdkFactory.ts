import { WixCodeApiFactoryArgs } from '@wix/thunderbolt-symbols'
import { namespace, name, DashboardWixCodeSdkHandlers, DashboardWixCodeSdkWixCodeApi } from '..'
import { dashboardApiFacadeFactory } from './services/dashboardApiFacadeFactory'
import { callDashboardApiFactory } from './services/callDashboardApiFactory'

export function DashboardSdkFactory({
	handlers,
}: WixCodeApiFactoryArgs<never, never, DashboardWixCodeSdkHandlers>): { [namespace]: DashboardWixCodeSdkWixCodeApi } {
	const callDashboardApi = callDashboardApiFactory(handlers[name].getDashboardApi)

	return {
		[namespace]: dashboardApiFacadeFactory(callDashboardApi),
	}
}
