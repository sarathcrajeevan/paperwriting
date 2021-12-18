import { withDependencies } from '@wix/thunderbolt-ioc'
import { IPageDidMountHandler, SdkHandlersProvider } from '@wix/thunderbolt-symbols'
import { ConsentPolicy } from '@wix/cookie-consent-policy-client'
import { ConsentPolicySymbol, name } from './symbols'
import { ConsentPolicySdkHandlers, ConsentPolicyUpdatesListener, IConsentPolicy } from './types'

export const ConsentPolicySdkHandlersProvider = withDependencies(
	[ConsentPolicySymbol],
	(consentPolicyApi: IConsentPolicy): SdkHandlersProvider<ConsentPolicySdkHandlers> & IPageDidMountHandler => {
		const sdkListeners: Array<ConsentPolicyUpdatesListener> = []
		const consentUpdatesListener: ConsentPolicyUpdatesListener = (policyDetails, policyHeaderObject) => {
			sdkListeners.forEach((listener) => listener(policyDetails, policyHeaderObject))
		}

		return {
			pageDidMount() {
				const unregister = consentPolicyApi.registerToChanges(consentUpdatesListener)
				return () => unregister()
			},
			getSdkHandlers: () => ({
				[name]: {
					setConsentPolicy: (policy: ConsentPolicy) => consentPolicyApi.setConsentPolicy(policy),
					resetConsentPolicy: () => consentPolicyApi.resetConsentPolicy(),
					registerToConsentPolicyUpdates: (listener: ConsentPolicyUpdatesListener) => {
						sdkListeners.push(listener)
					},
				},
			}),
		}
	}
)
