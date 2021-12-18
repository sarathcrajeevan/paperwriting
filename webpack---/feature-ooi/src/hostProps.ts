import _ from 'lodash'
import { Experiments } from '@wix/thunderbolt-symbols'
import { ISiteScrollBlocker } from 'feature-site-scroll-blocker'
import { IPageScrollRegistrar } from 'feature-page-scroll'
import type { FormFactor, OOIWidgetConfig, ViewMode } from './types'
import LazySentry from './lazySentry'

export function createHostProps({
	compData,
	pageId,
	accessibilityEnabled,
	formFactor,
	viewMode,
	siteScrollBlocker,
	registerToThrottledScroll,
	fonts,
	experiments,
}: {
	compData: OOIWidgetConfig
	pageId: string
	accessibilityEnabled: boolean
	formFactor: FormFactor
	viewMode: ViewMode
	siteScrollBlocker: ISiteScrollBlocker
	registerToThrottledScroll: IPageScrollRegistrar['registerToThrottledScroll']
	fonts: any
	experiments: Experiments
}) {
	return {
		styleId: compData.styleId,
		pageId,
		accessibilityEnabled,
		id: compData.compId,
		viewMode,
		formFactor,
		dimensions: compData.dimensions,
		isResponsive: compData.isResponsive,
		style: {
			styleParams: compData.style.style,
			siteColors: compData.style.siteColors,
			siteTextPresets: compData.style.siteTextPresets,
			fonts,
		},
		appLoadBI: {
			loaded: _.noop,
		},
		registerToScroll: registerToThrottledScroll,
		blockScroll: () => siteScrollBlocker.setSiteScrollingBlocked(true, compData.compId),
		unblockScroll: () => siteScrollBlocker.setSiteScrollingBlocked(false, compData.compId),
		updateLayout: _.noop,
		// TODO probably santa legacy. try removing this thing and see if things break.
		onSiteReady: (fn: any) => fn(),
		raven: null,
		Effect: null,
		LazySentry,
		shouldSetHeightOnWrapper: compData.isResponsive && experiments['specs.thunderbolt.tb_ooiHeight100P'],
	}
}
