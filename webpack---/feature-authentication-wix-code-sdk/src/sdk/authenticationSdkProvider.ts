import { withDependencies } from '@wix/thunderbolt-ioc'
import { SdkHandlersProvider } from '@wix/thunderbolt-symbols'
import { AuthenticationWixCodeSdkHandlers, ICaptchaDialog } from '../types'
import { name, CaptchaDialogApiSymbol } from '../symbols'

export const authenticationCodeSdkHandlersProvider = withDependencies(
	[CaptchaDialogApiSymbol],
	({
		openCaptchaDialog,
		withCaptchaChallengeHandler,
	}: ICaptchaDialog): SdkHandlersProvider<AuthenticationWixCodeSdkHandlers> => ({
		getSdkHandlers: () => ({
			[name]: {
				openCaptchaDialog,
				withCaptchaChallengeHandler,
			},
		}),
	})
)
