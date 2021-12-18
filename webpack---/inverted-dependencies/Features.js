export default class Features {
    constructor({
        experiments,
        appState: {
            env
        }
    }) {
        // centralized experiment conduction is currently supported in live sites only
        // so any experiment will always be false in editor, preview and bolt
        return {
            get fes() {
                return experiments.enabled('specs.wixDataViewer.EnableFES')
            },
            get warmupData() {
                return (
                    experiments.enabled('specs.wixDataViewer.UseWarmupData') && env.live
                )
            },
            get dropdownOptionsDistinct() {
                return experiments.enabled(
                    'specs.wixDataViewer.DropdownDistinctOptions',
                )
            },
            get dropdownOptionsUnique() {
                return (
                    experiments.enabled('specs.wixDataViewer.DropdownUniqueOptions') ||
                    env.editor
                )
            },
        }
    }
}