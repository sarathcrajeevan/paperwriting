import type { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { ScreenInInitCallbackFactory } from './screenInInitCallbackFactory'
import { ScreenInInit } from './screenInInit'
import { ScreenInDestroy } from './screenInDestroy'
import { LifeCycle } from '@wix/thunderbolt-symbols'
import { ScreenInInitCallbackSymbol } from './symbols'

export type { AnimationDef, Actions, ViewMode } from './types'

export const page: ContainerModuleLoader = (bind) => {
	bind(ScreenInInitCallbackSymbol).to(ScreenInInitCallbackFactory)
	bind(LifeCycle.PageWillMountHandler).to(ScreenInInit)
	bind(LifeCycle.PageWillUnmountHandler).to(ScreenInDestroy)
}
