import { withDependencies, optional } from '@wix/thunderbolt-ioc'
import { BrowserWindow, BrowserWindowSymbol, IStructureAPI, StructureAPI } from '@wix/thunderbolt-symbols'
import type { INavigation } from './types'
import {
	Router as RouterSymbol,
	IRouter,
	IUrlHistoryManager,
	UrlHistoryManagerSymbol,
	keepInternalQueryParamsOnly,
	IShouldNavigateHandler,
	ShouldNavigateHandlerSymbol,
} from 'feature-router'
import { IPopups, PopupsSymbol } from 'feature-popups'
import { SamePageScrollSymbol, ISamePageScroll } from 'feature-scroll-to-anchor'

const navigationFactory = (
	window: BrowserWindow,
	router: IRouter,
	urlManager: IUrlHistoryManager,
	samePageScroll: ISamePageScroll,
	structureApi: IStructureAPI,
	{ shouldNavigate }: IShouldNavigateHandler,
	popups?: IPopups
): INavigation => {
	return {
		navigateTo: async (linkProps, navigationParams) => {
			if (!shouldNavigate(linkProps)) {
				return false
			}
			const { href, target, linkPopupId, anchorDataId, anchorCompId, type } = linkProps

			// PopupPageLink
			if (linkPopupId) {
				popups!.openPopupPage(linkPopupId)
				return true
			}

			if (type === 'DocumentLink' || type === 'PhoneLink' || type === 'EmailLink' || type === 'ExternalLink') {
				window!.open(href, target)
				return true
			}

			// PageLink, DynamicPageLink, different page AnchorLink
			if (!router.isInternalValidRoute(href!)) {
				return false
			}
			const currentFullUrl = urlManager.getFullUrlWithoutQueryParams()
			const didNavigateToDifferentPage =
				currentFullUrl !== href && (await router.navigate(href!, { anchorDataId, ...navigationParams }))

			if (didNavigateToDifferentPage) {
				return true
			}

			/* THIS METHOD SHOULD RETURN FALSE FROM NOW ON */

			// Same page AnchorLink
			if (anchorCompId || anchorDataId) {
				if (anchorCompId && !window!.document.getElementById(anchorCompId)) {
					// anchor not on page
					return false
				}
				samePageScroll.scrollToAnchor({ anchorCompId, anchorDataId })
				return false
			}

			if (href) {
				const url = urlManager.getParsedUrl()
				// Clear all search params besides the internal query params, to make it possible to clear query params.
				url.search = keepInternalQueryParamsOnly(url.searchParams)
				// We're passing url.origin as base to allow parsing relative hrefs.
				const { searchParams: nextUrlSearchParams } = new URL(href, url.origin)

				nextUrlSearchParams.forEach((val, key) => url?.searchParams.set(key, val))

				urlManager.pushUrlState(url)

				// if same page navigation and popup is open we should close it
				if (popups?.getCurrentPopupId()) {
					popups.closePopupPage()
					return false
				}

				// Same page navigation triggered by state change doesn't scroll to top
				if (navigationParams?.disableScrollToTop) {
					return false
				}

				// Same page navigation with no anchors should scroll to top
				samePageScroll.scrollToAnchor({ anchorDataId: 'SCROLL_TO_TOP' })
				return false
			}
			return false
		},
	}
}

export const Navigation = withDependencies(
	[
		BrowserWindowSymbol,
		RouterSymbol,
		UrlHistoryManagerSymbol,
		SamePageScrollSymbol,
		StructureAPI,
		ShouldNavigateHandlerSymbol,
		optional(PopupsSymbol),
	],
	navigationFactory
)
