export default class DataCache {#
    warmupData
    constructor({
        warmupData
    }) {
        this.#warmupData = warmupData
    }

    get(name) {
        return this.#warmupData.get(name)
    }

    set(name, data) {
        this.#warmupData.set(name, data)
    }
}