import { loadScriptTag } from '@wix/thunderbolt-commons'
import { named, withDependencies } from '@wix/thunderbolt-ioc'
import {
	BrowserWindow,
	BrowserWindowSymbol,
	Experiments,
	ExperimentsSymbol,
	ILogger,
	LoggerSymbol,
	SiteFeatureConfigSymbol,
	ViewerModel,
	ViewerModelSym,
} from '@wix/thunderbolt-symbols'
import _ from 'lodash'
import React, { ComponentType } from 'react'
import ReactDOM from 'react-dom'
import { MODULE_URL } from '../constants'
import { OOIReporterSymbol, Reporter } from '../reporting'
import { ModuleFederationSharedScopeSymbol, name } from '../symbols'
import { Props } from '../tpaWidgetNativeFactory/tpaWidgetNative'
import type { OOIComponentLoader, WebpackSharedScope } from '../types'
import { loadComponentWithModuleFederation } from './loadComponentWithModuleFederation'
import { extractWidgetNameFromUrl } from '../extractWidgetNameFromUrl'

async function requireTpaWidgetNativeClient() {
	await window.externalsRegistry.react.loaded // wait for React to load since it is loaded dynamically
	return require('../tpaWidgetNativeFactory/tpaWidgetNativeClient')
}

async function loadRequireJS(window: NonNullable<BrowserWindow>, moduleRepoUrl: string = MODULE_URL, logger: ILogger) {
	// since react umd bundles do not define named modules, we must load react before loading requirejs.
	// further details here: https://requirejs.org/docs/errors.html#mismatch
	// requirejs will be hopefully removed once ooi comps will be consumed as comp libraries.
	await window.reactAndReactDOMLoaded
	await loadScriptTag(`${moduleRepoUrl}/requirejs-bolt@2.3.6/requirejs.min.js`)
	window.define!('lodash', [], () => _)
	window.define!('reactDOM', [], () => ReactDOM)
	window.define!('react', [], () => React)
	window.define!('imageClientSDK', [], () => window.__imageClientApi__.sdk)

	// @ts-ignore TODO fix requirejs type
	window.requirejs!.onError = (error) => {
		const { requireModules, requireType } = error
		logger.captureError(error, {
			tags: { feature: 'ooi', methodName: 'requirejs.onError' },
			extra: { requireModules, requireType },
		})
	}
}

export default withDependencies(
	[
		named(SiteFeatureConfigSymbol, name),
		ViewerModelSym,
		LoggerSymbol,
		OOIReporterSymbol,
		BrowserWindowSymbol,
		ExperimentsSymbol,
		ModuleFederationSharedScopeSymbol,
	],
	(
		{ ooiComponentsData },
		{ siteAssets }: ViewerModel,
		logger: ILogger,
		reporter: Reporter,
		window: NonNullable<BrowserWindow>,
		experiments: Experiments,
		sharedScope: WebpackSharedScope
	): OOIComponentLoader => {
		let waitForRequireJsToLoad: Promise<unknown> | null = null

		const load = <T>(url: string): Promise<T> =>
			new Promise(async (resolve, reject) => {
				waitForRequireJsToLoad =
					waitForRequireJsToLoad || loadRequireJS(window, siteAssets.clientTopology.moduleRepoUrl, logger)
				await waitForRequireJsToLoad

				__non_webpack_require__([url], (module: any) => resolve(module), reject)
			})

		async function loadFederated<T>(url: string): Promise<T> {
			waitForRequireJsToLoad =
				waitForRequireJsToLoad || loadRequireJS(window, siteAssets.clientTopology.moduleRepoUrl, logger)
			await waitForRequireJsToLoad
			const widgetName = extractWidgetNameFromUrl(url)
			const moduleFederationEntryUrl = url.replace(/\/[^/]+\.js$/, `/clientContainer${widgetName}.min.js`)

			return await loadComponentWithModuleFederation(moduleFederationEntryUrl, widgetName!, sharedScope)
		}

		return {
			async getComponent(widgetId: string) {
				if (!ooiComponentsData[widgetId]) {
					logger.captureError(new Error('widgetId could not be found in ooiComponentsData'), {
						tags: { feature: 'ooi', methodName: 'getComponent' },
						extra: { widgetId },
					})
					const { ooiReactComponentClientWrapper } = await requireTpaWidgetNativeClient()
					return { component: ooiReactComponentClientWrapper(null, reporter) }
				}

				const { componentUrl, isModuleFederated } = ooiComponentsData[widgetId]

				const module = await (isModuleFederated && experiments['specs.thunderbolt.module_federation']
					? loadFederated<ComponentType<Props>>(componentUrl)
					: load<ComponentType<Props>>(componentUrl)
				).catch(_.noop)

				const { ooiReactComponentClientWrapper } = await requireTpaWidgetNativeClient()
				// @ts-ignore
				const { component, chunkLoadingGlobal, loadableReady } = module?.default

				return {
					component: ooiReactComponentClientWrapper(component, reporter),
					chunkLoadingGlobal,
					loadableReady,
				}
			},
		}
	}
)
