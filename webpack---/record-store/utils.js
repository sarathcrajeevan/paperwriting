'use strict'

const assign = props => object => ({
    ...object,
    ...props,
})

const bind = (f, g) => o => g(f(o))(o)
const registrar = list => fn => {
    list.push(fn)
    return () => {
        const index = list.indexOf(fn)
        if (index >= 0) {
            list.splice(index, 1)
        }
    }
}

const memoize = (fn, resolveCacheKey, shouldUseCachedResult) => {
    const cache = new Map()

    return function(...args) {
        const cacheKey = resolveCacheKey(args)
        const cached = cache.get(cacheKey)

        if (cached && shouldUseCachedResult(args, cached.args)) {
            return cached.result
        }
        const result = fn.apply(this, args)
        cache.set(cacheKey, {
            args,
            result
        })

        return result
    }
}

export {
    assign,
    bind,
    registrar,
    memoize
}