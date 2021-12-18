'use strict'

import {
    union
} from '@wix/wix-code-adt'

const derivedMethods = {
    hasUrl: variant => () =>
        variant.matchWith({
            Empty: () => false,
            Loading: () => false,
            Loaded: () => true,
        }),
    shouldLoadUrl: variant => () =>
        variant.matchWith({
            Empty: () => false,
            Loading: () => true,
            Loaded: () => false,
        }),
}

const DynamicPageUrlLoadState = union(
    'DynamicPageUrlLoadState', {
        Empty() {},
        Loading() {},
        Loaded: url => {
            if (!url) {
                throw new Error('url must exist')
            }

            return {
                url
            }
        },
    },
    derivedMethods,
)

DynamicPageUrlLoadState.fromUrl = url =>
    url ? DynamicPageUrlLoadState.Loaded(url) : DynamicPageUrlLoadState.Empty()

export default DynamicPageUrlLoadState

export const {
    fromUrl
} = DynamicPageUrlLoadState