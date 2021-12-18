import { AuthenticationWixCodeSdkWixCodeApi } from 'feature-authentication-wix-code-sdk'
import { WixCodeApiFactoryArgs } from '@wix/thunderbolt-symbols'

export const getWithCaptchaChallengeHandler = (
	wixCodeNamespacesRegistry: WixCodeApiFactoryArgs['wixCodeNamespacesRegistry']
) => {
	const { withCaptchaChallengeHandler } = wixCodeNamespacesRegistry.get(
		'authentication'
	) as AuthenticationWixCodeSdkWixCodeApi
	return withCaptchaChallengeHandler
}
