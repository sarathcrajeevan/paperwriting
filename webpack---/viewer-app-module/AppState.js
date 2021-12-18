export default class AppState {#
    datasetConfigs

    constructor() {
        this.#datasetConfigs = new Map()
    }

    get datasetConfigs() {
        return this.#datasetConfigs
    }
}