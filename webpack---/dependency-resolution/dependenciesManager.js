'use strict'

export default () => {
    const dependencies = {}

    let unsubscribeHandles = []

    return {
        get: () => dependencies,
        add: entries => Object.assign(dependencies, entries),
        saveHandle: handle => unsubscribeHandles.push(handle),
        unsubscribe: () => {
            unsubscribeHandles.forEach(h => h())
            unsubscribeHandles = []
        },
    }
}