import type { ViewerModel } from '@wix/thunderbolt-symbols'

export const CORE_JS_BUNDLE_URL = 'https://static.parastorage.com/unpkg/core-js-bundle@3.2.1/minified.js'
export const PREACT_COMPAT_PROD_URL = 'https://static.parastorage.com/unpkg/preact@10.5.13/compat/dist/compat.umd.js'
export const PREACT_HOOKS_PROD_URL = 'https://static.parastorage.com/unpkg/preact@10.5.13/hooks/dist/hooks.umd.js'
export const PREACT_PROD_URL = 'https://static.parastorage.com/unpkg/preact@10.5.13/dist/preact.umd.js'

const getReactVersion = (viewerModel: ViewerModel) =>
	viewerModel.experiments['specs.thunderbolt.react_experimental']
		? '18.0.0-beta-149b420f6-20211119' // take from here: https://github.com/facebook/react/tags, or get latest nightly beta using yarn add react@beta
		: '16.13.1'
export const REACT_PROD_URL = (viewerModel: ViewerModel) =>
	`https://static.parastorage.com/unpkg/react@${getReactVersion(viewerModel)}/umd/react.production.min.js`
export const REACT_DEV_URL = (viewerModel: ViewerModel) =>
	`https://static.parastorage.com/unpkg/react@${getReactVersion(viewerModel)}/umd/react.development.js`
export const REACT_DOM_PROD_URL = (viewerModel: ViewerModel) =>
	`https://static.parastorage.com/unpkg/react-dom@${getReactVersion(viewerModel)}/umd/react-dom.production.min.js`
export const REACT_DOM_DEV_URL = (viewerModel: ViewerModel) =>
	`https://static.parastorage.com/unpkg/react-dom@${getReactVersion(viewerModel)}/umd/react-dom.development.js`
