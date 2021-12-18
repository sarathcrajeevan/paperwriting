import { withDependencies } from '@wix/thunderbolt-ioc'
import { IPropsStore, Props } from '@wix/thunderbolt-symbols'
import { IUrlHistoryManager, UrlHistoryManagerSymbol } from 'feature-router'
import { SiteMembersApiSymbol, ISiteMembersApi } from 'feature-site-members'
import { NavigationSymbol, INavigation } from 'feature-navigation'
import { ComponentWillMount, ViewerComponent } from 'feature-components'
import { resolveMemberDetails } from './resolveMemberDetails'

const loginSocialBarFactory = (
	siteMembersApi: ISiteMembersApi,
	propsStore: IPropsStore,
	urlHistoryManager: IUrlHistoryManager,
	{ navigateTo }: INavigation
): ComponentWillMount<ViewerComponent> => {
	return {
		componentTypes: ['LoginSocialBar'],
		async componentWillMount(loginBarComp) {
			const updateComponentProps = async () => {
				const currentPrimaryPageHref = urlHistoryManager.getFullUrlWithoutQueryParams()
				const memberDetails = await resolveMemberDetails(siteMembersApi)

				propsStore.update({
					[loginBarComp.id]: {
						currentPrimaryPageHref,
						...memberDetails,
						onLogout() {
							siteMembersApi.logout()
						},
						onLogin() {
							siteMembersApi.promptLogin()
						},
						navigateTo,
					},
				})
			}
			const onLoginCallbackId = siteMembersApi.registerToUserLogin(updateComponentProps)
			const onMemberDetailsRefreshCallbackId = siteMembersApi.registerToMemberDetailsRefresh(updateComponentProps)

			await updateComponentProps()

			return () => {
				siteMembersApi.unRegisterToUserLogin(onLoginCallbackId)
				siteMembersApi.unRegisterToMemberDetailsRefresh(onMemberDetailsRefreshCallbackId)
			}
		},
	}
}

export const LoginSocialBar = withDependencies(
	[SiteMembersApiSymbol, Props, UrlHistoryManagerSymbol, NavigationSymbol],
	loginSocialBarFactory
)
