import { namespace } from '../symbols'
import type { EnvironmentWixCodeSdkApi } from '../types'
import type { FetchFn, WixCodeApiFactoryArgs } from '@wix/thunderbolt-symbols'

declare const self: {
	importScripts: (...urls: Array<string>) => void
	fetch: FetchFn
}

export function EnvironmentSdkFactory({
	moduleLoader,
}: WixCodeApiFactoryArgs): {
	[namespace]: EnvironmentWixCodeSdkApi
} {
	return {
		[namespace]: {
			timers: {
				setTimeout,
				clearTimeout,
				setInterval,
				clearInterval,
			},
			network: {
				importScripts: (...args) => {
					console.warn(
						'Using importScripts api is not recommended as it may negatively impact SSR performance, consider using importAMDModule instead'
					)
					return self.importScripts(...args)
				},
				importAMDModule: moduleLoader.loadModule,
				fetch: self.fetch,
			},
			console,
		},
	}
}
