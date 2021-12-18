import { withDependencies } from '@wix/thunderbolt-ioc'
import { SdkHandlersProvider, BrowserWindow, BrowserWindowSymbol, IAppWillMountHandler } from '@wix/thunderbolt-symbols'
import { DashboardWixCodeSdkHandlers, ProxifiedDashboardApi } from '../types'
import { wrap, transfer, windowEndpoint, createEndpoint, Remote } from 'comlink/dist/esm/comlink.js' // eslint-disable-line no-restricted-syntax
import { callDashboardApiFactory } from './services/callDashboardApiFactory'
import { PopupProviderSymbol } from '../index'
import { IPopupApi } from './popupApiProvider'
import { name } from '../symbols'

const getDashboardApiFactory = (window: BrowserWindow) => {
	let dashboardApi: Remote<ProxifiedDashboardApi> | null = null

	return () => {
		if (!dashboardApi) {
			dashboardApi = wrap<ProxifiedDashboardApi>(windowEndpoint(window!.parent))
		}
		return dashboardApi
	}
}

export const dashboardWixCodeSdkHandlers = withDependencies(
	[BrowserWindowSymbol, PopupProviderSymbol],
	(
		window: BrowserWindow,
		popupApiProvider: () => Promise<IPopupApi>
	): SdkHandlersProvider<DashboardWixCodeSdkHandlers> & IAppWillMountHandler => {
		const getDashboardApi = getDashboardApiFactory(window)

		return {
			getSdkHandlers: () => ({
				[name]: {
					getDashboardApi: async () => {
						/// "Lazy" loading so the sled test has an opportunity to highjack window.parent...
						const dashboardApi = getDashboardApi()
						const port = await dashboardApi[createEndpoint]()

						return transfer(port, [port])
					},
				},
			}),
			async appWillMount() {
				const popupsApi = (await popupApiProvider()).getPopupsApi()
				if (popupsApi) {
					const dashboardApi = getDashboardApi()
					const callDashboardApi = callDashboardApiFactory(() => dashboardApi[createEndpoint]())
					popupsApi.registerToPopupEvent('popupOpen', () => {
						callDashboardApi('openLightbox')
					})
					popupsApi.registerToPopupEvent('popupClose', () => {
						callDashboardApi('closeLightbox')
					})
				}
			},
		}
	}
)
