import type { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { LoginSocialBar } from './loginSocialBar'
import { ComponentWillMountSymbol } from 'feature-components'

export const page: ContainerModuleLoader = (bind) => {
	bind(ComponentWillMountSymbol).to(LoginSocialBar)
}

export const editorPage = page

export { resolveMemberDetails } from './resolveMemberDetails'
