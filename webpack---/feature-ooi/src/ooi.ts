import { withDependencies, named } from '@wix/thunderbolt-ioc'
import {
	PageFeatureConfigSymbol,
	IPageWillMountHandler,
	IPropsStore,
	Props,
	SiteFeatureConfigSymbol,
	pageIdSym,
	PageScrollRegistrarSymbol,
	Experiments,
	ExperimentsSymbol,
	FeatureStateSymbol,
	IPageDidMountHandler,
	contextIdSymbol,
} from '@wix/thunderbolt-symbols'
import { SiteScrollBlockerSymbol, ISiteScrollBlocker } from 'feature-site-scroll-blocker'
import { IPageScrollRegistrar } from 'feature-page-scroll'
import { OoiTpaSharedConfigSymbol, IOoiTpaSharedConfig } from 'feature-ooi-tpa-shared-config'
import { IFeatureState } from 'thunderbolt-feature-state'
import { name } from './symbols'
import type { OOIPageConfig, OOISiteConfig } from './types'
import { createHostProps } from './hostProps'
import _ from 'lodash'

export const ooiPageWillMount = withDependencies(
	[
		pageIdSym,
		contextIdSymbol,
		named(PageFeatureConfigSymbol, name),
		named(SiteFeatureConfigSymbol, name),
		Props,
		SiteScrollBlockerSymbol,
		PageScrollRegistrarSymbol,
		OoiTpaSharedConfigSymbol,
		ExperimentsSymbol,
		named(FeatureStateSymbol, name),
	],
	(
		pageId,
		contextId,
		{ ooiComponents, accessibilityEnabled }: OOIPageConfig,
		{ viewMode, formFactor, ooiComponentsData }: OOISiteConfig,
		propsStore: IPropsStore,
		siteScrollBlocker: ISiteScrollBlocker,
		{ registerToThrottledScroll }: IPageScrollRegistrar,
		{ getFontsConfig }: IOoiTpaSharedConfig,
		experiments: Experiments,
		featureState: IFeatureState<{ [compId: string]: Array<Function> }>
	): IPageWillMountHandler & IPageDidMountHandler => {
		const getUniqueCompIdPerContextId = (compId: string) => `${contextId}_${compId}`

		return {
			async pageWillMount() {
				_.forEach(ooiComponents, (compData) => {
					const compId = compData.compId
					const uniqueCompId = getUniqueCompIdPerContextId(compId)

					const registerToComponentDidLayout = (handler: Function) => {
						const componentDidLayoutHandlers = featureState.get()?.[uniqueCompId] || []
						componentDidLayoutHandlers.push(handler)
						// the handlers are stored on feature state and not on this module's state because
						// props.host.registerToComponentDidLayout(cb) may be invoked within the ooi react componentDidMount() lifecycle
						// which is triggered once per master page component.
						featureState.update((state) => ({ ...state, [uniqueCompId]: componentDidLayoutHandlers }))
					}

					const unregisterFromComponentDidLayout = () =>
						featureState.update((state) => {
							delete state[uniqueCompId]
							return state
						})

					const hostProps = createHostProps({
						compData,
						pageId,
						accessibilityEnabled,
						formFactor,
						viewMode,
						siteScrollBlocker,
						registerToThrottledScroll,
						fonts: getFontsConfig(),
						experiments,
					})

					propsStore.update({
						[compId]: {
							host: {
								...hostProps,
								// TODO rename to "onComponentInteractive"
								registerToComponentDidLayout,
								unregisterFromComponentDidLayout,
							},
						},
					})
				})

				if (process.env.browser) {
					await window.reactAndReactDOMLoaded // loadable creates React Context on module state, so it has to be evaluated once React is defined.
					const { loadableReady } = require('@loadable/component')
					await Promise.all(
						Object.values(ooiComponents)
							.filter(({ widgetId }) => ooiComponentsData[widgetId]?.isLoadable)
							.map(
								({ compId, widgetId }) =>
									new Promise((resolve) => {
										const options: any = {
											namespace: compId,
										}
										const chunkLoadingGlobal = ooiComponentsData[widgetId]?.chunkLoadingGlobal
										if (chunkLoadingGlobal) {
											options.chunkLoadingGlobal = chunkLoadingGlobal
										}
										loadableReady(resolve as () => any, options)
									})
							)
					)
				}
			},
			pageDidMount() {
				_.forEach(ooiComponents, ({ compId }) => {
					const componentDidLayoutHandlers = featureState.get()?.[getUniqueCompIdPerContextId(compId)] || []
					componentDidLayoutHandlers.forEach((handler) => handler())
				})
			},
		}
	}
)
