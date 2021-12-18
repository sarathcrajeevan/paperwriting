import _ from 'lodash'
import type { ModelsAPI } from '@wix/thunderbolt-symbols'
import type { ComponentSdkFactory, componentSdkFactoryArgs } from '@wix/thunderbolt-platform-types'
import type { AppControllerSDK } from '../../types'
import type { ControllersExports } from '../types'
import type { IControllerEvents } from '../ControllerEvents'
import { composeSDKFactories, createElementPropsSDKFactory, childrenPropsSDKFactory } from '@wix/editor-elements-corvid-utils'

export const AppControllerSdk = ({
	controllersExports,
	modelsApi,
	controllerEventsFactory,
}: {
	controllersExports: ControllersExports
	modelsApi: ModelsAPI
	controllerEventsFactory: IControllerEvents
}): ComponentSdkFactory => {
	const sdk = AppControllerSdkFactory({ controllersExports, modelsApi, controllerEventsFactory })
	// remove `any` after https://jira.wixpress.com/browse/WCR-208
	return composeSDKFactories(createElementPropsSDKFactory(), sdk as any) as any
}

export const AppControllerWithChildrenSdk = ({
	controllersExports,
	modelsApi,
	controllerEventsFactory,
}: {
	controllersExports: ControllersExports
	modelsApi: ModelsAPI
	controllerEventsFactory: IControllerEvents
}): ComponentSdkFactory => {
	const sdk = AppControllerSdkFactory({ controllersExports, modelsApi, controllerEventsFactory })
	// remove `any` after https://jira.wixpress.com/browse/WCR-208
	return composeSDKFactories(createElementPropsSDKFactory(), childrenPropsSDKFactory, sdk as any) as any
}

function assignWithGettersAndSetters(target: any, source: any) {
	Object.defineProperties(target, _.fromPairs(Object.keys(source).map((key) => [key, Object.getOwnPropertyDescriptor(source, key)!])))
}

function AppControllerSdkFactory({
	controllersExports,
	modelsApi,
	controllerEventsFactory,
}: {
	controllersExports: ControllersExports
	modelsApi: ModelsAPI
	controllerEventsFactory: IControllerEvents
}): ComponentSdkFactory {
	return ({ compId, $wScope }: componentSdkFactoryArgs): AppControllerSDK => {
		const controllerEvents = controllerEventsFactory.createScopedControllerEvents(compId)
		const controllerExportsFunc = controllersExports[compId]
		const controllerExports = controllerExportsFunc ? controllerExportsFunc($wScope) || {} : {}

		const controllerApi = {
			get type() {
				return modelsApi.getControllerTypeByCompId(compId)
			},
			on(event: string, callback: Function, context: any) {
				controllerEvents.on(event, callback, context)
			},
			off(event: string, callback: Function) {
				controllerEvents.off(event, callback)
			},
			once(event: string, callback: Function, context: any) {
				controllerEvents.once(event, callback, context)
			},
		}
		assignWithGettersAndSetters(controllerApi, controllerExports)
		return controllerApi
	}
}
