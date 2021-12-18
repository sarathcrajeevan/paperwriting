class DataBindingAppContext {#
    context = new Proxy({}, {
        get(target, prop) {
            if (target[prop]) {
                return target[prop]
            } else {
                throw new ReferenceError(
                    `There is no ${prop} in context. Check if the context has been already set`,
                )
            }
        },
    }, )

    set(context) {
        Object.entries(context).forEach(
            ([prop, val]) => (this.#context[prop] = val),
        )
    }

    get() {
        return this.#context
    }
}

export const dataBindingAppContext = new DataBindingAppContext()
export default dataBindingAppContext.get()