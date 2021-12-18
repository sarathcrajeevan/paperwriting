export default function(adapterApi) {
    adapterApi.bindToComponent()
    return Promise.all(adapterApi.recordSetLoaded())
}