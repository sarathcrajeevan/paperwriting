import type { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { Repeaters } from './repeaters'
import { LifeCycle, WixCodeSdkHandlersProviderSym } from '@wix/thunderbolt-symbols'
import { name } from './symbols'

export const page: ContainerModuleLoader = (bind) => {
	bind(LifeCycle.PageWillMountHandler, LifeCycle.PageWillUnmountHandler, WixCodeSdkHandlersProviderSym).to(Repeaters)
}

export { name }
